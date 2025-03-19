import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockNotes = [
            { id: '1', title: 'Project Ideas', content: 'New AI project ideas to explore...', category: 'Work', created: '2023-05-15' },
            { id: '2', title: 'Meeting Notes', content: 'Notes from the team planning session...', category: 'Work', created: '2023-05-10' },
            { id: '3', title: 'Workout Plan', content: 'New workout routine for summer...', category: 'Health', created: '2023-05-05' },
            { id: '4', title: 'Birthday Party', content: 'Ideas for Sarah\'s surprise birthday party...', category: 'Personal', created: '2023-05-03' },
            { id: '5', title: 'Book Recommendations', content: 'List of sci-fi books to read next...', category: 'Personal', created: '2023-04-28' },
            { id: '6', title: 'App Concept', content: 'Ideas for a new mobile application focusing on sustainability...', category: 'Ideas', created: '2023-04-25' },
            { id: '7', title: 'Quarterly Review', content: 'Preparation notes for the quarterly performance review...', category: 'Work', created: '2023-04-20' }
          ];

          setNotes(mockNotes);
          setFilteredNotes(mockNotes);
          
          // Extract unique categories from notes
          const allCategories = ['All', ...new Set(mockNotes.map(note => note.category))];
          setCategories(allCategories);
          
          setIsLoading(false);
        }, 1000);
        
        // With real API:
        // const response = await axios.get('/api/notes');
        // setNotes(response.data);
        // setFilteredNotes(response.data);
        // const allCategories = ['All', ...new Set(response.data.map(note => note.category))];
        // setCategories(allCategories);
        // setIsLoading(false);
      } catch (err) {
        setError('Failed to load notes');
        setIsLoading(false);
        console.error('Notes loading error:', err);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    // Filter notes based on search term and category
    let results = notes;
    
    if (categoryFilter !== 'All') {
      results = results.filter(note => note.category === categoryFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredNotes(results);
  }, [notes, searchTerm, categoryFilter]);

  const handleDelete = async (id) => {
    try {
      // Simulate API call
      // await axios.delete(`/api/notes/${id}`);
      
      // Update local state
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      setFilteredNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  if (isLoading) {
    return <div className="card">Loading notes...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>My Notes</h2>
        <p>Manage your notes and use AI-powered features to organize and analyze them.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ width: '150px' }}>
            <select 
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Link to="/create" className="btn btn-primary" style={{ marginBottom: '20px', display: 'inline-block' }}>
          Create New Note
        </Link>
      </div>

      {filteredNotes.length > 0 ? (
        <div>
          {filteredNotes.map(note => (
            <div key={note.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                <span style={{ 
                  background: '#e9ecef', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem' 
                }}>{note.category}</span>
              </div>
              
              <p>{note.content}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <small>Created: {note.created}</small>
                
                <div>
                  <button 
                    className="btn" 
                    onClick={() => alert('Edit functionality would go here')}
                    style={{ marginRight: '10px', background: '#e9ecef' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No notes found. {notes.length > 0 ? 'Try changing your search or filter.' : 'Create your first note!'}</p>
        </div>
      )}
    </div>
  );
}

export default NotesList; 