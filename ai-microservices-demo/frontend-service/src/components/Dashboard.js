import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    categoryCounts: {},
    recentNotes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, fetch stats from the API
        // For demo, we'll just simulate data
        
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalNotes: 7,
            categoryCounts: {
              Work: 3,
              Personal: 2,
              Ideas: 1,
              Health: 1
            },
            recentNotes: [
              { id: '1', title: 'Project Ideas', content: 'New AI project ideas to explore...', category: 'Work', created: '2023-05-15' },
              { id: '2', title: 'Meeting Notes', content: 'Notes from the team planning session...', category: 'Work', created: '2023-05-10' },
              { id: '3', title: 'Workout Plan', content: 'New workout routine for summer...', category: 'Health', created: '2023-05-05' }
            ]
          });
          setIsLoading(false);
        }, 1000);
        
        // With real API:
        // const response = await axios.get('/api/notes/stats');
        // setStats(response.data);
        // setIsLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setIsLoading(false);
        console.error('Dashboard loading error:', err);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="card">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Welcome to your AI Notes Dashboard</h2>
        <p>Your personalized dashboard shows your note activity and AI-powered insights.</p>
      </div>

      <div className="card">
        <h3>Overview</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Total Notes</h4>
            <p style={{ fontSize: '2rem' }}>{stats.totalNotes}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4>Categories</h4>
            <p style={{ fontSize: '2rem' }}>{Object.keys(stats.categoryCounts).length}</p>
          </div>
        </div>
        <Link to="/notes" className="btn btn-primary">View All Notes</Link>
      </div>

      <div className="card">
        <h3>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.entries(stats.categoryCounts).map(([category, count]) => (
            <li key={category} style={{ 
              padding: '10px', 
              margin: '5px 0', 
              display: 'flex', 
              justifyContent: 'space-between',
              background: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <span>{category}</span>
              <span style={{ fontWeight: 'bold' }}>{count} notes</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Recent Notes</h3>
        {stats.recentNotes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stats.recentNotes.map(note => (
              <li key={note.id} style={{ 
                padding: '15px', 
                margin: '10px 0', 
                border: '1px solid #e9ecef',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>{note.title}</h4>
                  <span style={{ 
                    background: '#e9ecef', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem' 
                  }}>{note.category}</span>
                </div>
                <p style={{ margin: '5px 0' }}>{note.content.substring(0, 100)}...</p>
                <small>Created: {note.created}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent notes. <Link to="/create">Create your first note</Link>.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 