import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { apiService } from "../../services/api";

const RegionStatistics = ({ municipalNames }) => {
  const { isEnglish } = useLanguage();
  const [keyIndicators, setKeyIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeyIndicators = async () => {
      try {
        setLoading(true);
        const language = isEnglish === "EN" ? "en" : "ge";
        const response = await apiService.getKeyIndicators(language);
        
        if (response.success) {
          setKeyIndicators(response.data);
        } else {
          setError("Failed to load key indicators");
        }
      } catch (err) {
        console.error("Error fetching key indicators:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKeyIndicators();
  }, [isEnglish]);

  if (loading) {
    return (
      <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEnglish === "EN" ? "Statistics" : "სტატისტიკა"}
        </h2>
        <div className="text-red-500 text-sm">
          {isEnglish === "EN" ? "Error loading data" : "მონაცემების ჩატვირთვის შეცდომა"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/5 bg-white rounded-lg shadow-md p-4 max-h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {keyIndicators.find(item => item.ID === 1)?.keyIndicators || 
         (isEnglish === "EN" ? "Key Indicators" : "ძირითადი მაჩვენებლები")}
      </h2>

      <div className="space-y-2">
        {keyIndicators.filter(item => item.ID !== 1).map((indicator) => (
          <div 
            key={indicator.ID} 
            className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200"
            title={indicator.dataContent}
          >
            <div className="text-xs font-medium text-blue-700 mb-1 leading-tight">
              {indicator.keyIndicators}
            </div>
            <div className="text-sm font-bold text-blue-900">
              -
            </div>
          </div>
        ))}

        {/* Municipalities Section */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-xs font-medium text-purple-700 mb-1">
            {isEnglish === "EN" ? "Municipalities" : "მუნიციპალიტეტები"}
          </p>
          <p className="text-sm font-bold text-purple-900 mb-1">
            {municipalNames.length}
          </p>
          <div className="text-xs text-purple-600 max-h-24 overflow-y-auto">
            {municipalNames.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {municipalNames.map((municipality, index) => (
                  <li key={index} className="text-xs leading-tight">
                    {isEnglish === "EN"
                      ? municipality.nameEn
                      : municipality.nameGe}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {isEnglish === "EN" ? "Loading..." : "იტვირთება..."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center leading-tight">
            {isEnglish === "EN"
              ? "Data source: National Statistics Office of Georgia"
              : "მონაცემების წყარო: საქართველოს სტატისტიკის ეროვნული სამსახური"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionStatistics;
