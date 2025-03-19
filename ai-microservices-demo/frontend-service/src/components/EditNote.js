import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    // In a real app, we would fetch the note from the API
    // For demo, we'll simulate loading a note
    setTimeout(() => {
      // Mock data - in a real app this would come from your API
      const mockNote = {
        id: id,
        title: 'Sample Note ' + id,
        content: 'This is sample content for note ' + id + '. Edit this as needed.',
        category: 'Personal',
        createdAt: new Date().toISOString()
      };
      
      setTitle(mockNote.title);
      setContent(mockNote.content);
      setCategory(mockNote.category);
      setIsLoading(false);
    }, 1000);
    
    // With real API:
    // const fetchNote = async () => {
    //   try {
    //     const response = await axios.get(`/api/notes/${id}`);
    //     const note = response.data;
    //     setTitle(note.title);
    //     setContent(note.content);
    //     setCategory(note.category);
    //   } catch (err) {
    //     setError('Failed to load note');
    //     console.error('Error loading note:', err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchNote();
  }, [id]);

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
        // Logic to suggest a category based on content
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
    
    setIsSaving(true);
    setError('');
    
    try {
      // In a real app, we would update via the API
      // For demo, we'll just simulate success
      
      setTimeout(() => {
        setIsSaving(false);
        // Redirect to notes list
        navigate('/notes');
      }, 1000);
      
      // With real API:
      // const response = await axios.put(`/api/notes/${id}`, {
      //   title,
      //   content,
      //   category
      // });
      // setIsSaving(false);
      // navigate('/notes');
    } catch (err) {
      setIsSaving(false);
      setError('Failed to update note');
      console.error('Note update error:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading note...</div>;
  }

  return (
    <div className="card">
      <h2>Edit Note</h2>
      
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
            {isAnalyzing ? 'Analyzing...' : 'Re-Analyze Content'}
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSaving || !title || !content || !category}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button 
            type="button" 
            className="btn" 
            style={{ background: '#f8f9fa' }}
            onClick={() => navigate('/notes')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNote; 