import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import logoGeo from '../assets/images/logo_transparency_geo.png';
import logoEng from '../assets/images/logo_transparency_eng.png';
import flagGe from '../assets/images/ka.png';
import flagEn from '../assets/images/en.png';

// Constants for styling
const HEADER_CLASSES = "w-full bg-white border-b-2 border-gray-300 shadow-lg py-4 sticky top-0 z-[1000]";
const CONTAINER_CLASSES = "w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[80px] flex-col md:flex-row gap-4 md:gap-0";
const LOGO_CONTAINER_CLASSES = "flex-shrink-0 flex items-center order-2 md:order-1";
const LOGO_CLASSES = "h-12 sm:h-14 md:h-15 w-auto object-contain transition-all duration-300 ease-in-out animate-fade-in";
const TITLE_CONTAINER_CLASSES = "flex-1 flex justify-center items-center px-0 md:px-8 order-1 md:order-2";
const RIGHT_SECTION_CLASSES = "flex-shrink-0 flex flex-col items-end gap-3 order-3 md:order-3";
const LANGUAGE_CONTAINER_CLASSES = "flex items-center";
const COMPARISON_BUTTONS_CLASSES = "flex flex-col sm:flex-row items-center gap-2";
const LANGUAGE_SWITCHER_CLASSES = "flex items-center rounded-3xl p-1 backdrop-blur-sm border border-white/20 shadow-sm animate-scale-in";
const DIVIDER_CLASSES = "text-gray-400 font-light mx-2 select-none";
const FLAG_CLASSES = "w-6 h-4 object-cover rounded-sm transition-all duration-200 hover:scale-110 group-hover:brightness-110";

const getComparisonButtonClasses = () => `
  text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg 
  transition-all duration-300 transform hover:scale-105 active:scale-95
  focus:outline-none focus:ring-2 focus:ring-offset-2
  text-sm whitespace-nowrap hover:opacity-90
`.trim();

const getButtonClasses = (isActive) => `
  group bg-transparent border-none rounded-2xl px-3 py-2 cursor-pointer 
  transition-all duration-300 active:scale-95 flex items-center justify-center
  focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-white
  disabled:cursor-not-allowed disabled:opacity-100
  ${isActive 
    ? 'bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-lg shadow-zinc-500/30 transform scale-105' 
    : 'hover:bg-white/80 hover:shadow-md hover:scale-105'
  }
`.trim();

const getTitleClasses = (language) => `
  font-semibold text-slate-700 text-center m-0 leading-relaxed transition-all duration-300 animate-fade-in
  ${language === 'EN' 
    ? 'font-inter text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl' 
    : 'font-georgian text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl'
  }
`.trim();

/**
 * Header component with language switching and responsive design
 * Features: Dynamic logos, flag-based language switcher, accessibility support, optional back button
 */
const Header = memo(({ showBackButton = false, onBackClick = null, regionColor = "#6b7280" }) => {
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'GE' ? 'EN' : 'GE';
    changeLanguage(newLanguage);
  };

  const handleKeyPress = (event, targetLanguage) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (language !== targetLanguage) {
        toggleLanguage();
      }
    }
  };

  const handleRegionComparison = () => {
    // TODO: Implement region comparison functionality
    console.log('Region comparison clicked');
  };

  const handleMunicipalityComparison = () => {
    // TODO: Implement municipality comparison functionality
    console.log('Municipality comparison clicked');
  };

  const handleGenderStatistics = () => {
    // TODO: Implement gender statistics functionality
    console.log('Gender statistics clicked');
  };

  // Memoized values for performance
  const title = useMemo(() => {
    return language === 'EN' 
      ? 'Statistical Information by Regions and Municipalities of Georgia'
      : 'სტატისტიკური ინფორმაცია საქართველოს რეგიონებისა და მუნიციპალიტეტების მიხედვით';
  }, [language]);

  const comparisonButtons = useMemo(() => {
    return {
      regions: language === 'EN' ? 'Comparison of Regions' : 'რეგიონების შედარება',
      municipalities: language === 'EN' ? 'Comparison of Municipalities' : 'მუნიციპალიტეტების შედარება',
      genderStats: language === 'EN' ? 'Gender Statistics' : 'გენდერული სტატისტიკა'
    };
  }, [language]);

  const backButtonText = useMemo(() => {
    return language === 'EN' ? 'Back to Map' : 'უკან რუკაზე';
  }, [language]);

  const currentLogo = useMemo(() => {
    return language === 'GE' ? logoGeo : logoEng;
  }, [language]);

  const logoAlt = useMemo(() => {
    return `GEOSTAT - ${language === 'GE' ? 'Georgian' : 'English'} Logo`;
  }, [language]);

  return (
    <header className={HEADER_CLASSES}>
      <div className={CONTAINER_CLASSES}>
        {/* Logo Section with optional Back Button */}
        <div className="flex-shrink-0 flex flex-col items-center order-2 md:order-1">
          <img 
            src={currentLogo}
            alt={logoAlt}
            className={`${LOGO_CLASSES} cursor-pointer hover:opacity-80 transition-opacity`}
            loading="eager"
            key={language} // Force re-render for smooth transition
            onClick={handleLogoClick}
          />
          {showBackButton && onBackClick && (
            <button
              onClick={onBackClick}
              className="mt-2 px-3 py-1.5 text-white rounded text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              style={{ backgroundColor: regionColor }}
              aria-label={backButtonText}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backButtonText}
            </button>
          )}
        </div>
        
        {/* Title Section */}
        <div className={TITLE_CONTAINER_CLASSES}>
          <h1 
            data-lang={language.toLowerCase()}
            className={getTitleClasses(language)}
            key={language} // Force re-render for smooth transition
          >
            {title}
          </h1>
        </div>
        
        {/* Right Section: Language Switcher + Comparison Buttons */}
        <div className={RIGHT_SECTION_CLASSES}>
          {/* Language Switcher */}
          <div className={LANGUAGE_CONTAINER_CLASSES}>
            <div 
              className={LANGUAGE_SWITCHER_CLASSES} 
              role="group" 
              aria-label="Language selection"
            >
              {/* Georgian Language Button */}
              <button 
                className={getButtonClasses(language === 'GE')}
                onClick={() => language !== 'GE' && toggleLanguage()}
                onKeyDown={(e) => handleKeyPress(e, 'GE')}
                title="ქართული - Switch to Georgian"
                aria-label="Switch to Georgian language"
                aria-pressed={language === 'GE'}
                disabled={language === 'GE'}
                tabIndex={0}
              >
                <img 
                  src={flagGe}
                  alt="Georgian flag" 
                  className={FLAG_CLASSES}
                  loading="eager"
                />
              </button>
              
              {/* Divider */}
              <span className={DIVIDER_CLASSES} aria-hidden="true">|</span>
              
              {/* English Language Button */}
              <button 
                className={getButtonClasses(language === 'EN')}
                onClick={() => language !== 'EN' && toggleLanguage()}
                onKeyDown={(e) => handleKeyPress(e, 'EN')}
                title="English - Switch to English"
                aria-label="Switch to English language"
                aria-pressed={language === 'EN'}
                disabled={language === 'EN'}
                tabIndex={0}
              >
                <img 
                  src={flagEn}
                  alt="English flag" 
                  className={FLAG_CLASSES}
                  loading="eager"
                />
              </button>
            </div>
          </div>
          
          {/* Comparison Buttons */}
          <div className={COMPARISON_BUTTONS_CLASSES}>
            <button 
              className={getComparisonButtonClasses()}
              style={{ backgroundColor: regionColor }}
              onClick={handleRegionComparison}
              title={comparisonButtons.regions}
              aria-label={comparisonButtons.regions}
            >
              {comparisonButtons.regions}
            </button>
            <button 
              className={getComparisonButtonClasses()}
              style={{ backgroundColor: regionColor }}
              onClick={handleMunicipalityComparison}
              title={comparisonButtons.municipalities}
              aria-label={comparisonButtons.municipalities}
            >
              {comparisonButtons.municipalities}
            </button>
            <button 
              className={getComparisonButtonClasses()}
              style={{ backgroundColor: regionColor }}
              onClick={handleGenderStatistics}
              title={comparisonButtons.genderStats}
              aria-label={comparisonButtons.genderStats}
            >
              {comparisonButtons.genderStats}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

// PropTypes for type checking (development only)
Header.propTypes = {
  showBackButton: PropTypes.bool,
  onBackClick: PropTypes.func,
  regionColor: PropTypes.string,
};

export default Header;
