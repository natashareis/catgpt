import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import About from './About';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Detect system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme-mode');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and save preference
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-link">CatGPT</Link>
            <Link to="/about" className="nav-link">About The Developer</Link>
          </div>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer className="app-footer">
          <p>CatGPT v1.0</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;