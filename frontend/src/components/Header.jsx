import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './Header.scss';

const Header = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'GE' ? 'EN' : 'GE';
    changeLanguage(newLanguage);
  };

  const getTitle = () => {
    if (language === 'EN') {
      return 'Statistical Information by Regions and Municipalities of Georgia';
    }
    return 'სტატისტიკური ინფორმაცია საქართველოს რეგიონებისა და მუნიციპალიტეტების მიხედვით';
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img 
            src="/geostat-logo.svg" 
            alt="GEOSTAT" 
            className="header__logo-image"
          />
        </div>
        
        <div className="header__title">
          <h1 data-lang={language.toLowerCase()}>{getTitle()}</h1>
        </div>
        
        <div className="header__language">
          <div className="header__language-switcher">
            <button 
              className={`header__language-button ${language === 'GE' ? 'active' : ''}`}
              onClick={() => language !== 'GE' && toggleLanguage()}
            >
              ქარ
            </button>
            <span className="header__language-divider">|</span>
            <button 
              className={`header__language-button ${language === 'EN' ? 'active' : ''}`}
              onClick={() => language !== 'EN' && toggleLanguage()}
            >
              ENG
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
