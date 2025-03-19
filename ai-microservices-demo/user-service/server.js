const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/users';
let db;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db();
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Helper function to generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Register new user
app.post('/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Insert into database
    const result = await db.collection('users').insertOne(newUser);
    
    // Generate JWT
    const token = generateToken({ _id: result.insertedId, email });
    
    // Return user data and token
    res.status(201).json({
      id: result.insertedId,
      name,
      email,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = generateToken(user);
    
    // Return user data and token
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/users/:id', async (req, res) => {
  try {
    // Check authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get user ID from URL
    const userId = req.params.id;
    
    // Only allow users to access their own profile
    if (decoded.id !== userId && decoded.id !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Find user
    const user = await db.collection('users').findOne(
      { _id: ObjectId(userId) },
      { projection: { password: 0 } } // Don't return password
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/users/:id', async (req, res) => {
  try {
    // Check authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get user ID from URL
    const userId = req.params.id;
    
    // Only allow users to update their own profile
    if (decoded.id !== userId && decoded.id !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { name, email, password } = req.body;
    const updateData = {
      updated_at: new Date()
    };
    
    // Add fields to update
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const result = await db.collection('users').updateOne(
      { _id: ObjectId(userId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get updated user
    const updatedUser = await db.collection('users').findOne(
      { _id: ObjectId(userId) },
      { projection: { password: 0 } }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 8003;

async function startServer() {
  await connectToMongo();
  
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
}

startServer(); 