import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import the Adjara SVG as example (you can add more region SVGs later)
import adjaraSvg from "../assets/svg/adjara.svg";

// Region data from InteractiveMap
const regionData = {
  "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#7b818c" },
  "GE-TS": {
    nameEn: "Tskhinvali Region",
    nameGe: "ცხინვალის რეგიონი",
    color: "#7b818c",
  },
  "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#ce8d34" },
  "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#6ea76f" },
  "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#c85861" },
  "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#c85861" },
  "GE-KK": {
    nameEn: "Kvemo Kartli",
    nameGe: "ქვემო ქართლი",
    color: "#6ea76f",
  },
  "GE-MM": {
    nameEn: "Mtskheta-Mtianeti",
    nameGe: "მცხეთა-მთიანეთი",
    color: "#9e6e9c",
  },
  "GE-RL": {
    nameEn: "Racha-Lechkhumi",
    nameGe: "რაჭა-ლეჩხუმი",
    color: "#ce8d34",
  },
  "GE-SJ": {
    nameEn: "Samtskhe-Javakheti",
    nameGe: "სამცხე-ჯავახეთი",
    color: "#9e6e9c",
  },
  "GE-SK": {
    nameEn: "Shida Kartli",
    nameGe: "შიდა ქართლი",
    color: "#678dac",
  },
  "GE-SZ": {
    nameEn: "Samegrelo-Zemo Svaneti",
    nameGe: "სამეგრელო-ზემო სვანეთი",
    color: "#678dac",
  },
  "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#ce8d34" },
};

// Mapping from numeric region IDs to GE-XX codes
const regionIdMap = {
  "0": "GE", // საქართველო
  "11": "GE-TB", // ქ. თბილისი
  "15": "GE-AJ", // აჭარის ა.რ.
  "23": "GE-GU", // გურია
  "26": "GE-IM", // იმერეთი
  "29": "GE-KA", // კახეთი
  "32": "GE-MM", // მცხეთა-მთიანეთ
  "35": "GE-RL", // რაჭა-ლეჩხუმი და ქვემო სვანეთი
  "38": "GE-SZ", // სამეგრელო-ზემო სვანეთი
  "41": "GE-SJ", // სამცხე-ჯავახეთი
  "44": "GE-KK", // ქვემო ქართლი
  "47": "GE-SK", // შიდა ქართლი
};

// Region SVG mapping (you can add more as needed)
const regionSvgMap = {
  "GE-AJ": adjaraSvg,
  // Add more SVGs here as they become available
  // "GE-TB": tbilisiSvg,
  // "GE-GU": guriaSvg,
  // etc.
};

const RegionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();
  const [regionSvgContent, setRegionSvgContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get region data from ID
  const regionCode = regionIdMap[id];
  const region = regionCode ? regionData[regionCode] : null;

  // Get region name based on language
  const regionName = region
    ? isEnglish === "EN"
      ? region.nameEn
      : region.nameGe
    : "Unknown Region";

  useEffect(() => {
    const loadRegionSvg = async () => {
      if (!regionCode || !regionSvgMap[regionCode]) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(regionSvgMap[regionCode]);
        const svgText = await response.text();
        setRegionSvgContent(svgText);
      } catch (error) {
        console.error("Failed to load region SVG:", error);
        setError("Failed to load region map");
      } finally {
        setLoading(false);
      }
    };

    loadRegionSvg();
  }, [regionCode]);

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Region Not Found
            </h2>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-8xl mx-auto h-full">
          {/* Back button and title */}
          <div className="mb-4">
            <button
              onClick={handleBackClick}
              className="mb-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {isEnglish === "EN" ? "Back to Map" : "უკან რუკაზე"}
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{regionName}</h1>
          </div>

          {/* Three-section layout: 20% - 60% - 20% */}
          <div className="h-full min-h-[600px] flex gap-4">
            {/* Left Section (20%) */}
            <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isEnglish === "EN" ? "Region Info" : "რეგიონის ინფორმაცია"}
              </h2>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">
                    {isEnglish === "EN" ? "Region" : "რეგიონი"}:
                  </p>
                  <p className="font-medium text-gray-900">{regionName}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">
                    {isEnglish === "EN" ? "Color" : "ფერი"}:
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-sm font-mono">{region.color}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">
                    {isEnglish === "EN" ? "Region ID" : "რეგიონის ID"}:
                  </p>
                  <p className="font-medium text-gray-900">{id}</p>
                </div>
              </div>
            </div>

            {/* Center Section (60%) - Map Display */}
            <div className="w-3/5 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isEnglish === "EN" ? "Region Map" : "რეგიონის რუკა"}
              </h2>
              
              <div className="h-full bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      {isEnglish === "EN" ? "Loading map..." : "იტვირთება რუკა..."}
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600">
                    <p>{error}</p>
                  </div>
                ) : regionSvgContent ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: regionSvgContent }}
                    style={{
                      minHeight: "400px",
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                    <p className="text-lg">
                      {isEnglish === "EN" 
                        ? "Detailed map not available" 
                        : "დეტალური რუკა მიუწვდომელია"}
                    </p>
                    <p className="text-sm mt-2">
                      {isEnglish === "EN" 
                        ? "Region data is available in the sidebar" 
                        : "რეგიონის მონაცემები ხელმისაწვდომია გვერდითი პანელში"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section (20%) */}
            <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isEnglish === "EN" ? "Statistics" : "სტატისტიკა"}
              </h2>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-600 mb-1">
                    {isEnglish === "EN" ? "Population" : "მოსახლეობა"}
                  </p>
                  <p className="text-lg font-bold text-blue-900">-</p>
                  <p className="text-xs text-blue-700">
                    {isEnglish === "EN" ? "Data pending" : "მონაცემები მომზადდება"}
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-600 mb-1">
                    {isEnglish === "EN" ? "Area" : "ფართობი"}
                  </p>
                  <p className="text-lg font-bold text-green-900">-</p>
                  <p className="text-xs text-green-700">
                    {isEnglish === "EN" ? "Data pending" : "მონაცემები მომზადდება"}
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-sm text-purple-600 mb-1">
                    {isEnglish === "EN" ? "Municipalities" : "მუნიციპალიტეტები"}
                  </p>
                  <p className="text-lg font-bold text-purple-900">-</p>
                  <p className="text-xs text-purple-700">
                    {isEnglish === "EN" ? "Data pending" : "მონაცემები მომზადდება"}
                  </p>
                </div>
                
                <div className="mt-6 p-3 bg-gray-100 rounded">
                  <p className="text-xs text-gray-600 text-center">
                    {isEnglish === "EN" 
                      ? "More detailed statistics will be available soon" 
                      : "მეტი დეტალური სტატისტიკა მალე ხელმისაწვდომი იქნება"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RegionDetail;
