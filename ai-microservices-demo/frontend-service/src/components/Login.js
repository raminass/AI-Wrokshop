import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate a successful login without backend authentication
      // In a real app, we would make a request to the authentication API
      
      // Simulate API call
      // const response = await axios.post('/api/auth/login', { username, password });
      
      // Since we don't have a user service fully integrated, we'll just simulate login for demo
      setTimeout(() => {
        setIsLoading(false);
        onLogin(username);
        navigate('/');
      }, 1000);
      
      // If using real authentication:
      // localStorage.setItem('token', response.data.token);
      // onLogin(username);
      // navigate('/');
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <p>Sign in to access your AI-powered notes</p>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        <p>For demo purposes, you can enter any username and password</p>
      </div>
    </div>
  );
}

export default Login; 