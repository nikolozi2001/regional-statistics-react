import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

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
    <header className="bg-white border-b-2 border-gray-300 shadow-lg py-4 sticky top-0 z-[1000]">
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between min-h-[80px] flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex-shrink-0 flex items-center order-2 md:order-1">
          <img 
            src="/geostat-logo.svg" 
            alt="GEOSTAT" 
            className="h-15 w-auto object-contain"
          />
        </div>
        
        <div className="flex-1 flex justify-center items-center px-0 md:px-8 order-1 md:order-2">
          <h1 
            data-lang={language.toLowerCase()}
            className={`font-semibold text-slate-700 text-center m-0 leading-relaxed transition-all duration-300 ${
              language === 'EN' 
                ? 'font-sans text-lg md:text-xl lg:text-2xl' 
                : 'text-base md:text-lg lg:text-xl'
            }`}
            style={{ fontFamily: language === 'EN' ? 'Inter, sans-serif' : 'Noto Sans Georgian, Inter, sans-serif' }}
          >
            {getTitle()}
          </h1>
        </div>
        
        <div className="flex-shrink-0 flex items-center order-3">
          <div className="flex items-center bg-white/10 rounded-3xl p-1 backdrop-blur-sm border border-white/20">
            <button 
              className={`bg-transparent border-none rounded-2xl px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 font-sans active:scale-95 ${
                language === 'GE' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-500 hover:text-slate-700 hover:bg-white/80'
              }`}
              onClick={() => language !== 'GE' && toggleLanguage()}
            >
              ქარ
            </button>
            <span className="text-gray-400 font-light mx-2 select-none">|</span>
            <button 
              className={`bg-transparent border-none rounded-2xl px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 font-sans active:scale-95 ${
                language === 'EN' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-500 hover:text-slate-700 hover:bg-white/80'
              }`}
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
