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
  "GE-TB": "თბილისი",
};

const RegionStatistics = ({ regionCode }) => {
  const { isEnglish } = useLanguage();
  const [keyIndicators, setKeyIndicators] = useState([]);
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping of keyIndicator IDs to region data fields
  const dataMapping = {
    2: "Area",
    3: "Population",
    4: "liveBirth",
    5: "death",
    6: "naturalIncrease",
    7: "GDP",
    8: "GDPPerCapita",
    9: "UnemploymentRate",
    10: "EmploymentRate",
    11: "EmploymentRateIndustry",
    12: "AverageSalaryIndustry",
    13: "RegistredEntities",
    14: "activeEntities",
    15: "newlyRegistredEntities",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const language = isEnglish === "EN" ? "en" : "ge";

        // Fetch both APIs
        const [indicatorsResponse, regionsResponse] = await Promise.all([
          apiService.getKeyIndicators(language),
          apiService.getRegionsData(),
        ]);

        if (indicatorsResponse.success) {
          setKeyIndicators(indicatorsResponse.data);
        }

        if (regionsResponse.success && regionCode) {
          // Find the region data based on the region code
          const regionName = regionMapping[regionCode];
          const currentRegion = regionsResponse.data.find(
            (region) =>
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
      <div className="w-1/5 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="space-y-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-1/5 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
          {isEnglish === "EN" ? "Key Indicators" : "ძირითადი მაჩვენებლები"}
        </h2>
        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
          {isEnglish === "EN"
            ? "Error loading data"
            : "მონაცემების ჩატვირთვის შეცდომა"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/4 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
        {keyIndicators.find((item) => item.ID === 1)?.keyIndicators ||
          (isEnglish === "EN" ? "Key Indicators" : "ძირითადი მაჩვენებლები")}
      </h2>

      <div className="space-y-1">
        {keyIndicators
          .filter((item) => item.ID !== 1)
          .map((indicator) => (
            <div
              key={indicator.ID}
              className="group w-full text-left rounded-xl hover:bg-gray-50/80 transition-all duration-300 ease-out flex items-center justify-between group-hover:shadow-sm border border-transparent hover:border-gray-100"
              title={indicator.dataContent}
            >
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-200 mb-1">
                  {indicator.keyIndicators}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {getValue(indicator.ID)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RegionStatistics;
