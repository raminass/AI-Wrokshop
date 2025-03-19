const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config();

// Service URLs
const NOTES_SERVICE_URL = process.env.NOTES_SERVICE_URL || 'http://localhost:8001';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8003';

// JWT Secret (same as user service)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Skip authentication for health check endpoints
  if (req.path.endsWith('/health')) {
    return next();
  }
  
  // Skip authentication for login and register endpoints
  if (req.path === '/auth/login' || req.path === '/auth/register') {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Service health check
app.get('/services-health', async (req, res) => {
  try {
    const services = [
      { name: 'notes-service', url: `${NOTES_SERVICE_URL}/health` },
      { name: 'ai-service', url: `${AI_SERVICE_URL}/health` },
      { name: 'user-service', url: `${USER_SERVICE_URL}/health` }
    ];
    
    const results = {};
    
    for (const service of services) {
      try {
        const response = await axios.get(service.url, { timeout: 3000 });
        results[service.name] = response.data.status === 'healthy' ? 'up' : 'down';
      } catch (error) {
        results[service.name] = 'down';
      }
    }
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check services health' });
  }
});

// Auth routes (User service)
app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
});

// Apply authentication middleware for protected routes
app.use(authenticateToken);

// User routes
app.use('/users/:id', async (req, res, next) => {
  try {
    // Extract user ID from the URL
    const userId = req.params.id;
    
    // Check if the user is accessing their own profile
    if (req.user.id !== userId && req.user.id !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Forward the request to the user service
    const response = await axios({
      method: req.method,
      url: `${USER_SERVICE_URL}/users/${userId}`,
      headers: {
        'Authorization': req.headers.authorization
      },
      data: req.body
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'User service error' });
    }
  }
});

// Notes routes
app.use('/notes', async (req, res) => {
  // Attach user_id from JWT if not provided (for GET requests)
  if (req.method === 'GET' && !req.query.user_id) {
    req.query.user_id = req.user.id;
  }
  
  // Attach user_id from JWT if not provided (for POST requests)
  if (req.method === 'POST' && !req.body.user_id) {
    req.body.user_id = req.user.id;
  }
  
  try {
    // Forward the request to the notes service
    let url = `${NOTES_SERVICE_URL}/notes`;
    
    // For specific note operations (GET, PUT, DELETE)
    if (req.params.id) {
      url += `/${req.params.id}`;
    }
    
    // Add query parameters for GET requests
    if (req.method === 'GET' && Object.keys(req.query).length > 0) {
      const queryParams = new URLSearchParams(req.query).toString();
      url += `?${queryParams}`;
    }
    
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Notes service error' });
    }
  }
});

// Notes routes with ID
app.use('/notes/:id', async (req, res) => {
  try {
    // Forward the request to the notes service
    const response = await axios({
      method: req.method,
      url: `${NOTES_SERVICE_URL}/notes/${req.params.id}`,
      data: req.body
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Notes service error' });
    }
  }
});

// AI service analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'AI service error' });
    }
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Notes Service URL: ${NOTES_SERVICE_URL}`);
  console.log(`AI Service URL: ${AI_SERVICE_URL}`);
  console.log(`User Service URL: ${USER_SERVICE_URL}`);
}); 