import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegionInfo from "../components/regiondetail/RegionInfo";

// Import the main Georgia SVG to extract region paths
import georgiaSvg from "../assets/svg/georgia.svg";

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
  0: "GE", // საქართველო
  11: "GE-TB", // ქ. თბილისი
  15: "GE-AJ", // აჭარის ა.რ.
  23: "GE-GU", // გურია
  26: "GE-IM", // იმერეთი
  29: "GE-KA", // კახეთი
  32: "GE-MM", // მცხეთა-მთიანეთ
  35: "GE-RL", // რაჭა-ლეჩხუმი და ქვემო სვანეთი
  38: "GE-SZ", // სამეგრელო-ზემო სვანეთი
  41: "GE-SJ", // სამცხე-ჯავახეთი
  44: "GE-KK", // ქვემო ქართლი
  47: "GE-SK", // შიდა ქართლი
};

// Region SVG mapping - now using main Georgia SVG
const regionSvgMap = {
  "GE-AJ": georgiaSvg,
  "GE-AB": georgiaSvg,
  "GE-TS": georgiaSvg,
  "GE-GU": georgiaSvg,
  "GE-IM": georgiaSvg,
  "GE-KA": georgiaSvg,
  "GE-MM": georgiaSvg,
  "GE-RL": georgiaSvg,
  "GE-SZ": georgiaSvg,
  "GE-SJ": georgiaSvg,
  "GE-KK": georgiaSvg,
  "GE-SK": georgiaSvg,
  "GE-TB": georgiaSvg,
};

// Region-specific transform data for proper display
const regionTransforms = {
  "GE-AJ": { scale: 5.2, originX: 490, originY: 850 }, // Adjara
  "GE-GU": { scale: 6.0, originX: 550, originY: 700 }, // Guria
  "GE-IM": { scale: 4.5, originX: 500, originY: 600 }, // Imereti
  "GE-KA": { scale: 4.0, originX: 750, originY: 500 }, // Kakheti
  "GE-KK": { scale: 5.0, originX: 600, originY: 800 }, // Kvemo Kartli
  "GE-MM": { scale: 5.5, originX: 650, originY: 400 }, // Mtskheta-Mtianeti
  "GE-RL": { scale: 7.0, originX: 450, originY: 350 }, // Racha-Lechkhumi
  "GE-SJ": { scale: 4.8, originX: 400, originY: 700 }, // Samtskhe-Javakheti
  "GE-SK": { scale: 5.5, originX: 600, originY: 600 }, // Shida Kartli
  "GE-SZ": { scale: 4.2, originX: 350, originY: 450 }, // Samegrelo-Zemo Svaneti
  "GE-TB": { scale: 8.0, originX: 650, originY: 650 }, // Tbilisi
  "GE-AB": { scale: 4.0, originX: 300, originY: 300 }, // Abkhazia
  "GE-TS": { scale: 6.5, originX: 600, originY: 500 }, // Tskhinvali Region
};

const RegionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();
  const [regionSvgContent, setRegionSvgContent] = useState(null);
  const [municipalNames, setMunicipalNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get region data from ID
  const regionCode = regionIdMap[id];
  const region = regionCode ? regionData[regionCode] : null;

  // Municipal name extraction helper function
  const extractMunicipalNames = (svgDoc, regionCode) => {
    const municipalities = [];

    // Map region codes to their municipal key prefixes
    const regionPrefixMap = {
      "GE-AB": "ABKHAZIA",
      "GE-SZ": "SAMEGRELO",
      "GE-GU": "GURIA",
      "GE-AJ": "ADJARA",
      "GE-SJ": "SAMTSKHE",
      "GE-IM": "IMERETI",
      "GE-RL": "RACHA",
      "GE-KK": "KVEMO",
      "GE-KA": "KAKHETI",
      "GE-TB": "TBILISI",
      "GE-MM": "MTSKHETA",
      "GE-SK": "SHIDA",
      "GE-TS": "TSKHINVALI",
    };

    const prefix = regionPrefixMap[regionCode];
    if (!prefix) return municipalities;

    // Find all tspan elements with Key attributes starting with the region prefix
    const tspans = svgDoc.querySelectorAll(`tspan[Key^="${prefix}_"]`);

    tspans.forEach((tspan) => {
      const key = tspan.getAttribute("Key");
      const georgianName = tspan.textContent;

      // Extract municipal name from key (remove prefix)
      const municipalKey = key.replace(`${prefix}_`, "");

      municipalities.push({
        key: municipalKey,
        nameGe: georgianName,
        nameEn: municipalKey.toLowerCase().replace(/_/g, " "),
      });
    });

    return municipalities;
  };

  useEffect(() => {
    const loadRegionSvg = async () => {
      if (!regionCode || !regionSvgMap[regionCode]) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(regionSvgMap[regionCode]);
        const svgText = await response.text();

        // Parse the SVG to extract only the specific region
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        // Find the specific region path by its id
        const regionPath = svgDoc.querySelector(`#${regionCode}`);

        if (regionPath) {
          // Get the original viewBox and dimensions
          const originalSvg = svgDoc.querySelector("svg");
          const viewBox =
            originalSvg.getAttribute("viewBox") || "0 0 1000 1000";

          // Extract municipal names for this region
          const municipalities = extractMunicipalNames(svgDoc, regionCode);
          setMunicipalNames(municipalities);

          // Get municipal text elements for this region
          const regionPrefixMap = {
            "GE-AB": "ABKHAZIA",
            "GE-SZ": "SAMEGRELO",
            "GE-GU": "GURIA",
            "GE-AJ": "ADJARA",
            "GE-SJ": "SAMTSKHE",
            "GE-IM": "IMERETI",
            "GE-RL": "RACHA",
            "GE-KK": "KVEMO",
            "GE-KA": "KAKHETI",
            "GE-TB": "TBILISI",
            "GE-MM": "MTSKHETA",
            "GE-SK": "SHIDA",
            "GE-TS": "TSKHINVALI",
          };

          const prefix = regionPrefixMap[regionCode];
          let municipalTexts = "";

          if (prefix) {
            const textElements = svgDoc.querySelectorAll(`text`);
            textElements.forEach((textEl) => {
              const tspan = textEl.querySelector(`tspan[Key^="${prefix}_"]`);
              if (tspan) {
                const clonedText = textEl.cloneNode(true);
                municipalTexts += clonedText.outerHTML;
              }
            });
          }

          // Get region-specific transform data
          const transform = regionTransforms[regionCode] || {
            scale: 5.0,
            originX: 500,
            originY: 500,
          };

          // Create a new SVG with just the region path
          const regionSvg = `
            <svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
              <style>
                .region-path {
                  fill: ${region.color};
                  stroke: #fff;
                  stroke-width: 0.5;
                  transition: all 0.3s ease;
                  transform: scale(${transform.scale});
                  -webkit-transform-origin-x: ${transform.originX}px;
                  -webkit-transform-origin-y: ${transform.originY}px;
                }
                .region-path:hover {
                  filter: brightness(1.1);
                }
                  text {
                  transform: scale(${transform.scale - 3.8});
                  -webkit-transform-origin-x: ${transform.originX}px;
                  -webkit-transform-origin-y: ${transform.originY}px;
                  font-family: Arial, sans-serif;
                  fill: #2d3748;
                  font-weight: bold;
                  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
                }
                tspan {
                  font-size: 29px !important;
                }
              </style>
              ${regionPath.outerHTML.replace(
                /class="[^"]*"/,
                'class="region-path"'
              )}
              ${municipalTexts}
            </svg>
          `;

          setRegionSvgContent(regionSvg);
        } else {
          setError("Region path not found in SVG");
        }
      } catch (error) {
        console.error("Failed to load region SVG:", error);
        setError("Failed to load region map");
      } finally {
        setLoading(false);
      }
    };

    loadRegionSvg();
  }, [regionCode, region]);

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
      {/* Header with Back Button */}
      <Header
        showBackButton={true}
        onBackClick={handleBackClick}
        regionColor={region?.color || "#6b7280"}
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-8xl mx-auto h-full">
          {/* Three-section layout: 20% - 60% - 20% */}
          <div className="h-full min-h-[600px] flex gap-4">
            {/* Left Section (20%) */}
            <RegionInfo />

            {/* Center Section (60%) - Map Display */}
            <div className="w-3/5 bg-white rounded-lg shadow-md p-4 h-full">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {isEnglish === "EN"
                      ? "Loading map..."
                      : "იტვირთება რუკა..."}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-20">
                  <p>{error}</p>
                </div>
              ) : regionSvgContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: regionSvgContent }}
                  style={{
                    minHeight: "400px",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3"
                    />
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
                    {isEnglish === "EN"
                      ? "Data pending"
                      : "მონაცემები მომზადდება"}
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-600 mb-1">
                    {isEnglish === "EN" ? "Area" : "ფართობი"}
                  </p>
                  <p className="text-lg font-bold text-green-900">-</p>
                  <p className="text-xs text-green-700">
                    {isEnglish === "EN"
                      ? "Data pending"
                      : "მონაცემები მომზადდება"}
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-sm text-purple-600 mb-1">
                    {isEnglish === "EN" ? "Municipalities" : "მუნიციპალიტეტები"}
                  </p>
                  <p className="text-lg font-bold text-purple-900">
                    {municipalNames.length}
                  </p>
                  <div className="text-xs text-purple-700 max-h-32 overflow-y-auto">
                    {municipalNames.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {municipalNames.map((municipality, index) => (
                          <li key={index} className="text-xs">
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
