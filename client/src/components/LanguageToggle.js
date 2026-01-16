import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      title={language === 'en' ? 'Français' : 'English'}
      aria-label="Toggle language"
    >
      {language === 'en' ? 'CA - FR' : 'CA - EN'}
    </button>
  );
}

export default LanguageToggle;
