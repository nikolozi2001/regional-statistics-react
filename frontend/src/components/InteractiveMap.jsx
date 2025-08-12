import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const InteractiveMap = () => {
  const { isEnglish } = useLanguage();

  return (
    <div className="h-full bg-white">
      <div className="h-full p-4 md:p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-base md:text-lg text-center px-4">
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