import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'CA-EN', fullName: 'English (Canada)' },
    { code: 'fr', label: 'CA-FR', fullName: 'Français (Canada)' },
    { code: 'pt', label: 'BR-PT', fullName: 'Português (Brasil)' }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-toggle" ref={dropdownRef} data-testid="language-toggle">
      <button 
        className="language-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        data-testid="language-toggle-button"
      >
        {currentLang.label}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown" data-testid="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === language ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
              data-testid={`language-option-${lang.code}`}
              aria-label={`Switch to ${lang.fullName}`}
            >
              <span className="lang-code">{lang.label}</span>
              <span className="lang-name">{lang.fullName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageToggle;
