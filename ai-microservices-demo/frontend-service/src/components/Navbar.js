import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes, we'll default to logged in
  const [username, setUsername] = useState('DemoUser');
  const location = useLocation();

  const handleLogout = () => {
    // In a real app, this would call an API to logout
    setIsLoggedIn(false);
    setUsername('');
    // Would typically redirect to login page
  };

  const handleLogin = () => {
    // For demo purposes only
    setIsLoggedIn(true);
    setUsername('DemoUser');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>AI Notes</h1>
      </div>
      <nav className="navbar-nav">
        {isLoggedIn ? (
          <>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
            <Link 
              to="/notes" 
              className={location.pathname === '/notes' ? 'nav-link active' : 'nav-link'}
            >
              Notes
            </Link>
            <Link 
              to="/notes/new" 
              className={location.pathname === '/notes/new' ? 'nav-link active' : 'nav-link'}
            >
              Create Note
            </Link>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout ({username})
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="btn btn-login">
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar; 