import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import NotesList from './components/NotesList';
import CreateNote from './components/CreateNote';
import EditNote from './components/EditNote';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/new" element={<CreateNote />} />
            <Route path="/notes/edit/:id" element={<EditNote />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 