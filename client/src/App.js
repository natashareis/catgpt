import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import Chat from './Chat';
import Tests from './Tests';
import About from './About';
import LanguageToggle from './components/LanguageToggle';
import ContactModal from './components/ContactModal';

function App() {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
      <div className="App" data-testid="app-container">
        <nav className="navbar" data-testid="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-link" data-testid="nav-link-brand">{t('nav.brand')}</Link>
            <Link to="/tests" className="nav-link" data-testid="nav-link-tests">{t('nav.tests')}</Link>
            <Link to="/about" className="nav-link" data-testid="nav-link-about">{t('nav.about')}</Link>
          </div>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode" data-testid="theme-toggle-button">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer className="app-footer" data-testid="app-footer">
          <div className="footer-content">
            <p data-testid="footer-version">{t('footer.version')}</p>
            <button className="contact-button" onClick={() => setIsContactModalOpen(true)} data-testid="footer-contact-button">
              {t('footer.contact')}
            </button>
          </div>
        </footer>
        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        <LanguageToggle />
      </div>
    </Router>
  );
}

export default App;