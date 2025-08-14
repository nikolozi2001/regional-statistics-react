import React, { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { apiService } from "../../services/api";

// Mapping of region codes to region names for matching
const regionMapping = {
  "GE-AJ": "აჭარის ა.რ",
  "GE-GU": "გურია",
  "GE-IM": "იმერეთი",
  "GE-KA": "კახეთი",
  "GE-KK": "ქვემო ქართლი",
  "GE-MM": "მცხეთა-მთიანეთი",
  "GE-RL": "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
  "GE-SJ": "სამცხე-ჯავახეთი",
  "GE-SZ": "სამეგრელო-ზემო სვანეთი",
  "GE-SK": "შიდა ქართლი",
  "GE-TB": "თბილისი"
};

const RegionStatistics = ({ municipalNames, regionCode }) => {
  const { isEnglish } = useLanguage();
  const [keyIndicators, setKeyIndicators] = useState([]);
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping of keyIndicator IDs to region data fields
  const dataMapping = {
    2: 'Area',
    3: 'Population',
    4: 'liveBirth',
    5: 'death',
    6: 'naturalIncrease',
    7: 'GDP',
    8: 'GDPPerCapita',
    9: 'UnemploymentRate',
    10: 'EmploymentRate',
    11: 'EmploymentRateIndustry',
    12: 'AverageSalaryIndustry',
    13: 'RegistredEntities',
    14: 'activeEntities',
    15: 'newlyRegistredEntities'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const language = isEnglish === "EN" ? "en" : "ge";
        
        // Fetch both APIs
        const [indicatorsResponse, regionsResponse] = await Promise.all([
          apiService.getKeyIndicators(language),
          apiService.getRegionsData()
        ]);
        
        if (indicatorsResponse.success) {
          setKeyIndicators(indicatorsResponse.data);
        }
        
        if (regionsResponse.success && regionCode) {
          // Find the region data based on the region code
          const regionName = regionMapping[regionCode];
          const currentRegion = regionsResponse.data.find(region => 
            region.Name === regionName || region.NameEN === regionName
          );
          setRegionData(currentRegion);
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEnglish, regionCode]);

  // Helper function to get the value for a specific indicator
  const getValue = (indicatorId) => {
    if (!regionData || !dataMapping[indicatorId]) return "-";
    const field = dataMapping[indicatorId];
    const value = regionData[field];
    return value || "-";
  };

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
              {getValue(indicator.ID)}
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
