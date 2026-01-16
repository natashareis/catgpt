import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
