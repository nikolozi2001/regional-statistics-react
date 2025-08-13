import React, { useEffect, useRef, useCallback, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import georgiaMap from "../assets/svg/georgia.svg";
import backgroundIMG from "../assets/images/reg_photos/15.jpg";

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
};

const InteractiveMap = () => {
  const { isEnglish } = useLanguage();
  const svgRef = useRef(null);
  const [zoomedRegion, setZoomedRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [error, setError] = useState(null);

  // Function to toggle region zoom
  const toggleRegionZoom = useCallback((id) => {
    setZoomedRegion((current) => (current === id ? null : id));
  }, []);

  // Function to handle region click - updates with numerical ID from mapping
  const handleRegionClick = useCallback(
    (id) => {
      setSelectedRegion((prev) => {
        const numericId = regionIdMap[id];
        return prev === numericId ? null : numericId;
      });
      toggleRegionZoom(id);
    },
    [toggleRegionZoom]
  );

  // Function to handle region hover - still using the GE-XX format for hovering
  const handleRegionHover = (id) => setHoveredRegion(id);

  // Helper function to get GE-XX code from a numeric region ID
  const getGeCodeFromRegionId = useCallback((numericId) => {
    return Object.keys(regionIdMap).find(
      (key) => regionIdMap[key] === numericId
    );
  }, []);

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
            .map-tooltip {
              position: fixed;
              padding: 10px 14px;
              background: rgba(55, 200, 245, 0.95);
              color: white;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.2s ease;
              z-index: 1000;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              backdrop-filter: blur(10px);
            }
            .map-tooltip.visible {
              opacity: 1;
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
              .map-tooltip {
                font-size: 12px;
                padding: 8px 10px;
              }
            }
            
            @media (max-width: 480px) {
              #georgia-map-container svg .region-label {
                font-size: 9px !important;
              }
              .map-tooltip {
                font-size: 11px;
                padding: 6px 8px;
              }
            }
          `;

          svgElement.appendChild(style);

          // Create tooltip element
          const tooltip = document.createElement("div");
          tooltip.className = "map-tooltip";
          document.body.appendChild(tooltip);

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
                isEnglish === "GE"
                  ? regionData[id].nameGe
                  : regionData[id].nameEn;

              // Update tooltip content and position on hover
              const showTooltip = (event) => {
                tooltip.textContent =
                  isEnglish === "GE"
                    ? regionData[id].nameGe
                    : regionData[id].nameEn;
                tooltip.style.left = event.pageX + "px";
                tooltip.style.top = event.pageY - 10 + "px";
                tooltip.classList.add("visible");
              };

              const hideTooltip = () => {
                tooltip.classList.remove("visible");
              };

              // Add hover events to both path and label
              path.addEventListener("mousemove", showTooltip);
              path.addEventListener("mouseleave", hideTooltip);
              label.addEventListener("mousemove", showTooltip);
              label.addEventListener("mouseleave", hideTooltip);

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

  // Effect to update selected/hovered/zoomed state
  useEffect(() => {
    if (!svgRef.current) return;
    const selectedGeCode = getGeCodeFromRegionId(selectedRegion);
    const paths = svgRef.current.querySelectorAll("path");

    paths.forEach((path) => {
      const pathId = path.getAttribute("id");
      if (pathId) {
        // Handle selection highlighting
        path.classList.toggle("selected", pathId === selectedGeCode);

        // Handle zoom state
        path.classList.toggle("zoomed", pathId === zoomedRegion);
        path.classList.toggle(
          "region-hidden",
          zoomedRegion !== null && pathId !== zoomedRegion
        );

        // Zoom functionality
        if (pathId === zoomedRegion) {
          const bbox = path.getBBox();
          // Add responsive padding based on viewport
          const isSmallScreen = window.innerWidth < 768;
          const padding = isSmallScreen ? 15 : 30;
          const viewBox = `${bbox.x - padding} ${bbox.y - padding} ${
            bbox.width + padding * 2
          } ${bbox.height + padding * 2}`;
          svgRef.current.setAttribute("viewBox", viewBox);
          svgRef.current.style.transition = "all 0.6s ease-in-out";
        } else if (!zoomedRegion) {
          // Reset to original viewBox when no region is zoomed
          const fullBbox = svgRef.current.getBBox();
          const padding = 10;
          svgRef.current.setAttribute(
            "viewBox",
            `${fullBbox.x - padding} ${fullBbox.y - padding} ${
              fullBbox.width + padding * 2
            } ${fullBbox.height + padding * 2}`
          );
          svgRef.current.style.transition = "all 0.6s ease-in-out";
        }
      }
    });
  }, [selectedRegion, hoveredRegion, zoomedRegion, getGeCodeFromRegionId]);

  return (
    <div className="h-full bg-white">
      <div className="h-full p-2 md:p-4 lg:p-6">
        {error ? (
          <div className="h-full flex items-center justify-center bg-red-50 rounded-lg border-2 border-dashed border-red-300">
            <p className="text-red-500 text-base md:text-lg text-center px-4">
              {error}
            </p>
          </div>
        ) : (
          <div 
            className="h-full w-full relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
            style={{
              position: 'relative'
            }}
          >
            {/* Background image with opacity */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${backgroundIMG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3,
              }}
            />
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
