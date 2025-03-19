import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    "Work",
    "Personal",
    "Shopping",
    "Ideas",
    "Health",
    "Finance",
    "Travel",
    "Education"
  ];

  const analyzeContent = async () => {
    if (!content.trim()) {
      alert('Please enter some content to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      // In a real app, we would call the AI service API
      // For demo, we'll simulate a categorization response
      
      setTimeout(() => {
        // Randomly select a category based on the content
        let suggestedCategory;
        
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('meet') || lowerContent.includes('project') || lowerContent.includes('team')) {
          suggestedCategory = 'Work';
        } else if (lowerContent.includes('buy') || lowerContent.includes('store') || lowerContent.includes('purchase')) {
          suggestedCategory = 'Shopping';
        } else if (lowerContent.includes('health') || lowerContent.includes('exercise') || lowerContent.includes('workout')) {
          suggestedCategory = 'Health';
        } else if (lowerContent.includes('idea') || lowerContent.includes('concept') || lowerContent.includes('invent')) {
          suggestedCategory = 'Ideas';
        } else {
          // Fallback to a random category
          const randomIndex = Math.floor(Math.random() * categories.length);
          suggestedCategory = categories[randomIndex];
        }
        
        setCategory(suggestedCategory);
        setIsAnalyzing(false);
      }, 1500);
      
      // With real API:
      // const response = await axios.post('/api/analyze/categorize', { text: content });
      // setCategory(response.data.category);
      // setIsAnalyzing(false);
    } catch (err) {
      setIsAnalyzing(false);
      setError('Failed to analyze content');
      console.error('Analysis error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, we would save to the API
      // For demo, we'll just simulate success
      
      setTimeout(() => {
        setIsLoading(false);
        // Redirect to notes list
        navigate('/notes');
      }, 1000);
      
      // With real API:
      // const response = await axios.post('/api/notes', {
      //   title,
      //   content,
      //   category
      // });
      // setIsLoading(false);
      // navigate('/notes');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to create note');
      console.error('Note creation error:', err);
    }
  };

  return (
    <div className="card">
      <h2>Create New Note</h2>
      <p>Fill in the details below. Our AI will help categorize your note based on its content.</p>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            className="form-control"
            style={{ minHeight: '150px' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ background: '#e9ecef' }}
            onClick={analyzeContent}
            disabled={isAnalyzing || !content}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze & Suggest Category'}
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || !title || !content || !category}
        >
          {isLoading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
}

export default CreateNote; 