import React, { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import georgiaMap from "../assets/svg/georgia.svg";

// Data configuration
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

// Mapping from GE-XX codes to numerical region IDs for database queries
const regionIdMap = {
  GE: "0", // საქართველო
  "GE-TB": "11", // ქ. თბილისი
  "GE-AJ": "15", // აჭარის ა.რ.
  "GE-GU": "23", // გურია
  "GE-IM": "26", // იმერეთი
  "GE-KA": "29", // კახეთი
  "GE-MM": "32", // მცხეთა-მთიანეთ
  "GE-RL": "35", // რაჭა-ლეჩხუმი და ქვემო სვანეთი
  "GE-SZ": "38", // სამეგრელო-ზემო სვანეთი
  "GE-SJ": "41", // სამცხე-ჯავახეთი
  "GE-KK": "44", // ქვემო ქართლი
  "GE-SK": "47", // შიდა ქართლი
  "GE-AB": null, // Disputed territory - no navigation
  "GE-TS": null, // Disputed territory - no navigation
};

const InteractiveMap = () => {
  const { isEnglish } = useLanguage();
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [_hoveredRegion, setHoveredRegion] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle region click - navigates to region detail page
  const handleRegionClick = useCallback(
    (id) => {
      // Skip navigation for disputed territories
      if (id === "GE-AB" || id === "GE-TS") {
        return;
      }

      const numericId = regionIdMap[id];
      if (numericId) {
        const currentLanguage = isEnglish ? "en" : "ge";
        navigate(`/${currentLanguage}/region/${numericId}`);
      }
    },
    [navigate, isEnglish]
  );

  // Function to handle region hover - still using the GE-XX format for hovering
  const handleRegionHover = (id) => setHoveredRegion(id);

  // Effect to handle SVG loading and manipulation
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(georgiaMap);
        const svgText = await response.text();

        const mapContainer = document.getElementById("georgia-map-container");
        if (!mapContainer) return;

        mapContainer.innerHTML = svgText;
        const svgElement = mapContainer.querySelector("svg");
        svgRef.current = svgElement;

        if (svgElement) {
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svgElement.style.maxWidth = "100%";
          svgElement.style.maxHeight = "100%";
          svgElement.style.display = "block";

          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
            svgElement.setAttribute("viewBox", viewBox);
          }

          // Add styles with zoom transitions
          const style = document.createElement("style");
          style.textContent = `
            #georgia-map-container {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            #georgia-map-container svg {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            #georgia-map-container svg path {
              stroke: white;
              stroke-width: 0.8;
              cursor: pointer !important;
              opacity: 0.9 !important;
              filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1)) !important;
              transition: all 0.3s ease-in-out !important;
              transform-origin: center;
            }
            #georgia-map-container svg path[id="GE-AB"],
            #georgia-map-container svg path[id="GE-TS"] {
              cursor: not-allowed !important;
              opacity: 0.6 !important;
            }
            #georgia-map-container svg path:hover {
              opacity: 1 !important;
              stroke-width: 1.5 !important;
              stroke: white !important;
              filter: brightness(1.1) saturate(1.3) drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.15)) !important;
            }
            #georgia-map-container svg path.zoomed {
              opacity: 1 !important;
              stroke: white !important;
              stroke-width: 1 !important;
              filter: brightness(1.05) saturate(1.1) !important;
            }
            #georgia-map-container svg path:not(.zoomed).region-hidden {
              opacity: 0.1 !important;
              pointer-events: none !important;
              transition: opacity 0.5s ease !important;
            }
            #georgia-map-container svg .region-label {
              font-family: 'FiraGO', sans-serif !important;
              font-size: 12px !important;
              font-weight: 600 !important;
              fill: white !important;
              text-anchor: middle !important;
              pointer-events: none !important;
              opacity: 0 !important;
              transition: all 0.3s ease !important;
              text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5) !important;
            }
            #georgia-map-container svg path:hover + .region-label,
            #georgia-map-container svg path.zoomed + .region-label {
              opacity: 1 !important;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
              #georgia-map-container svg path {
                stroke-width: 1;
              }
              #georgia-map-container svg path:hover {
                stroke-width: 1.5;
              }
              #georgia-map-container svg .region-label {
                font-size: 10px !important;
              }
            }
            
            @media (max-width: 480px) {
              #georgia-map-container svg .region-label {
                font-size: 9px !important;
              }
            }
          `;

          svgElement.appendChild(style);

          // Apply colors to regions and add event listeners
          const paths = svgElement.querySelectorAll("path");
          paths.forEach((path) => {
            const id = path.getAttribute("id");
            if (id && regionData[id]) {
              // Set fill color with inline style for highest specificity
              path.setAttribute("fill", regionData[id].color);
              path.style.fill = regionData[id].color + " !important";

              // Remove title elements to prevent default tooltips
              const titles = path.getElementsByTagName("title");
              while (titles.length > 0) {
                titles[0].remove();
              }

              // Add region labels
              const bbox = path.getBBox();
              const labelX = bbox.x + bbox.width / 2;
              const labelY = bbox.y + bbox.height / 2;

              const label = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
              );
              label.setAttribute("class", "region-label");
              label.setAttribute("x", labelX);
              label.setAttribute("y", labelY);
              label.textContent =
                isEnglish
                  ? regionData[id].nameEn
                  : regionData[id].nameGe;

              path.parentNode.insertBefore(label, path.nextSibling);

              // Add event listeners for click and hover
              path.addEventListener("click", () => handleRegionClick(id));
              path.addEventListener("mouseenter", () => handleRegionHover(id));
              path.addEventListener("mouseleave", () => setHoveredRegion(null));
            }
          });
        }
      } catch (error) {
        console.error("Failed to load or process the SVG:", error);
        setError("Failed to load map data");
      }
    };

    loadSvg();

    return () => {
      const mapContainer = document.getElementById("georgia-map-container");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, [handleRegionClick, isEnglish]); // Added language dependency

  return (
    <div className="h-full bg-transparent">
      <div className="h-full p-2 md:p-4 lg:p-6">
        {error ? (
          <div className="h-full flex items-center justify-center bg-red-50 rounded-lg border-2 border-dashed border-red-300">
            <p className="text-red-500 text-base md:text-lg text-center px-4">
              {error}
            </p>
          </div>
        ) : (
          <div className="h-full w-full relative bg-transparent overflow-hidden">
            <div
              id="georgia-map-container"
              className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
              style={{
                minHeight: "400px",
                maxHeight: "800px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
