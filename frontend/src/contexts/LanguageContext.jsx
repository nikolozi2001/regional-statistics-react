import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('GE');

  // Get language from URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'en') {
      setLanguage('EN');
    } else {
      setLanguage('GE');
    }
  }, [location]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Update URL based on language
    const currentPath = location.pathname;
    let newPath;
    
    if (newLanguage === 'EN') {
      // Add /en prefix
      if (currentPath.startsWith('/en')) {
        newPath = currentPath;
      } else if (currentPath.startsWith('/ge')) {
        newPath = currentPath.replace('/ge', '/en');
      } else {
        newPath = '/en' + currentPath;
      }
    } else {
      // Add /ge prefix (or remove /en)
      if (currentPath.startsWith('/en')) {
        newPath = currentPath.replace('/en', '/ge');
      } else if (currentPath.startsWith('/ge')) {
        newPath = currentPath;
      } else {
        newPath = '/ge' + currentPath;
      }
    }
    
    navigate(newPath);
  };

  const value = {
    language,
    changeLanguage,
    isEnglish: language === 'EN',
    isGeorgian: language === 'GE'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
