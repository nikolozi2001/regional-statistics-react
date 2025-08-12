import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './InteractiveMap.scss';

const InteractiveMap = () => {
  const { isEnglish } = useLanguage();

  return (
    <div className="interactive-map">
      <div className="interactive-map__container">
        <h3 className="interactive-map__title">
          {isEnglish ? 'Interactive Map' : 'ინტერაქტიული რუკა'}
        </h3>
        <div className="interactive-map__content">
          <p>
            {isEnglish 
              ? 'Interactive map component will be implemented here.' 
              : 'ინტერაქტიული რუკის კომპონენტი აქ განთავსდება.'
            }
          </p>
          {/* Map implementation will go here */}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;