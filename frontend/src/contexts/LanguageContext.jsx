import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize language from localStorage or default to 'GE'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || 'GE';
  });

  // Get language from URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const urlLanguage = pathParts[1];
    
    if (urlLanguage === 'en') {
      setLanguage('EN');
      localStorage.setItem('preferredLanguage', 'EN');
    } else if (urlLanguage === 'ge') {
      setLanguage('GE');
      localStorage.setItem('preferredLanguage', 'GE');
    } else {
      // If no language prefix or invalid prefix, try to preserve current language
      // Only default to GE if this is the initial load
      const hasLanguagePrefix = urlLanguage === 'en' || urlLanguage === 'ge';
      if (!hasLanguagePrefix && location.pathname !== '/') {
        // Redirect to current language version if path doesn't have language prefix
        const currentLang = language === 'EN' ? 'en' : 'ge';
        navigate(`/${currentLang}${location.pathname}`, { replace: true });
      }
    }
  }, [location, navigate, language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    
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
