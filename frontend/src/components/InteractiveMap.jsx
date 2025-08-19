import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import georgiaMap from "../assets/svg/georgia.svg";

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
  "GE-KK": { nameEn: "Kvemo Kartli", nameGe: "ქვემო ქართლი", color: "#6ea76f" },
  "GE-MM": {
    nameEn: "Mtskheta-Mtianeti",
    nameGe: "მცხეთა-მთიანეთი",
    color: "#9e6e9c",
  },
  "GE-RL": {
    nameEn: "Racha-Lechkhumi And Kvemo Svaneti",
    nameGe: "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
    color: "#ce8d34",
  },
  "GE-SJ": {
    nameEn: "Samtskhe-Javakheti",
    nameGe: "სამცხე-ჯავახეთი",
    color: "#9e6e9c",
  },
  "GE-SK": { nameEn: "Shida Kartli", nameGe: "შიდა ქართლი", color: "#678dac" },
  "GE-SZ": {
    nameEn: "Samegrelo-Zemo Svaneti",
    nameGe: "სამეგრელო-ზემო სვანეთი",
    color: "#678dac",
  },
  "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#ce8d34" },
};

const regionIdMap = {
  "GE-TB": "11",
  "GE-AJ": "15",
  "GE-GU": "23",
  "GE-IM": "26",
  "GE-KA": "29",
  "GE-MM": "32",
  "GE-RL": "35",
  "GE-SZ": "38",
  "GE-SJ": "41",
  "GE-KK": "44",
  "GE-SK": "47",
  "GE-AB": null,
  "GE-TS": null,
};

const InteractiveMap = () => {
  const { isEnglish } = useLanguage();
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedRegionData = useMemo(() => regionData, []);

  const handleRegionClick = useCallback(
    (id) => {
      if (id === "GE-AB" || id === "GE-TS") return;
      const numericId = regionIdMap[id];
      if (numericId) {
        const currentLanguage = isEnglish ? "en" : "ge";
        navigate(`/${currentLanguage}/region/${numericId}`);
      }
    },
    [navigate, isEnglish]
  );

  const handleRegionHover = useCallback((id) => {
    setHoveredRegion(id);
  }, []);

  const handleRegionLeave = useCallback(() => {
    setHoveredRegion(null);
  }, []);

  useEffect(() => {
    const loadSvg = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(georgiaMap);
        if (!response.ok) throw new Error("Failed to load SVG");
        const svgText = await response.text();

        const mapContainer = document.getElementById("georgia-map-container");
        if (!mapContainer) return;

        mapContainer.innerHTML = svgText;
        const svgElement = mapContainer.querySelector("svg");
        svgRef.current = svgElement;

        if (svgElement) {
          // Basic SVG setup
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svgElement.style.maxWidth = "100%";
          svgElement.style.maxHeight = "100%";
          svgElement.style.display = "block";

          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            svgElement.setAttribute(
              "viewBox",
              `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
            );
          }

          // Create groups for proper layering
          const pathsGroup = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          pathsGroup.setAttribute("class", "map-paths");

          const labelsGroup = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          labelsGroup.setAttribute("class", "map-labels");

          // Move all paths to paths group
          const existingPaths = Array.from(svgElement.querySelectorAll("path"));
          existingPaths.forEach((path) => pathsGroup.appendChild(path));

          // Add groups to SVG (labels last to ensure they're on top)
          svgElement.appendChild(pathsGroup);
          svgElement.appendChild(labelsGroup);

          // Add styles
          const style = document.createElement("style");
          style.textContent = `
            #georgia-map-container {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
            
            #georgia-map-container svg {
              width: 100%;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            
            #georgia-map-container svg .map-paths path {
              stroke: white;
              stroke-width: 0.8;
              cursor: pointer;
              opacity: 0.9;
              transition: all 0.2s ease;
              transform-origin: center;
              pointer-events: all;
            }
            
            #georgia-map-container svg .map-paths path[id="GE-AB"],
            #georgia-map-container svg .map-paths path[id="GE-TS"] {
              cursor: not-allowed;
              opacity: 0.6;
            }
            
            #georgia-map-container svg .map-paths path:hover,
            #georgia-map-container svg .map-paths path.highlighted {
              opacity: 1;
              stroke-width: 1.5;
              stroke: white;
              filter: brightness(1.1) saturate(1.3);
              transform: scale(1.005);
            }
            
            /* Region labels - always on top */
            #georgia-map-container svg .map-labels .region-label {
              font-family: 'FiraGO', sans-serif;
              font-size: 20px;
              font-weight: 600;
              fill: white;
              text-anchor: middle;
              pointer-events: none;
              opacity: 1;
              transition: all 0.2s ease;
              text-shadow: 
                1px 1px 3px rgba(0, 0, 0, 0.8),
                -1px -1px 3px rgba(0, 0, 0, 0.8);
              user-select: none;
            }
            
            /* Highlight labels on hover */
            #georgia-map-container svg .map-paths path:hover ~ .map-labels .region-label[data-region="${"${id}"}"],
            #georgia-map-container svg .map-paths path.highlighted ~ .map-labels .region-label[data-region="${"${id}"}"] {
              font-weight: 700;
              font-size: 13px;
              filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
              #georgia-map-container svg .map-labels .region-label {
                font-size: 10px;
              }
              
              #georgia-map-container svg .map-paths path:hover ~ .map-labels .region-label[data-region="${"${id}"}"],
              #georgia-map-container svg .map-paths path.highlighted ~ .map-labels .region-label[data-region="${"${id}"}"] {
                font-size: 11px;
              }
            }
            
            @media (max-width: 480px) {
              #georgia-map-container svg .map-labels .region-label {
                font-size: 8px;
              }
              
              #georgia-map-container svg .map-paths path:hover ~ .map-labels .region-label[data-region="${"${id}"}"],
              #georgia-map-container svg .map-paths path.highlighted ~ .map-labels .region-label[data-region="${"${id}"}"] {
                font-size: 9px;
              }
            }
          `;
          svgElement.appendChild(style);

          // Process all paths and add labels
          const paths = Array.from(pathsGroup.querySelectorAll("path"));

          paths.forEach((path) => {
            const id = path.getAttribute("id");
            if (id && memoizedRegionData[id]) {
              // Set fill color
              path.setAttribute("fill", memoizedRegionData[id].color);

              // Remove any existing titles
              const titles = path.getElementsByTagName("title");
              while (titles.length > 0) {
                titles[0].remove();
              }

              // Calculate label position with adjustments
              const bbox = path.getBBox();
              let labelX = bbox.x + bbox.width / 2;
              let labelY = bbox.y + bbox.height / 2;

              // Position adjustments for specific regions
              // REGION-SPECIFIC POSITIONING
              if (id === "GE-TB") labelY += 8; // Tbilisi
              else if (id === "GE-AJ") {
                labelX -= 10;
                labelY += 5;
              } // Adjara
              else if (id === "GE-MM") labelY -= 8; // Mtskheta-Mtianeti
              else if (id === "GE-SZ") {
                // Adjusted position for Samegrelo-Zemo Svaneti
                labelX += 15;
                labelY -= 20;
              } else if (id === "GE-RL") {
                // Adjusted position for Racha-Lechkhumi
                labelX -= 5;
                labelY += 3;
              }

              // Create label
              const label = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
              );
              label.setAttribute("class", "region-label");
              label.setAttribute("data-region", id);
              label.setAttribute("x", labelX);
              label.setAttribute("y", labelY);
              label.textContent = isEnglish
                ? memoizedRegionData[id].nameEn
                : memoizedRegionData[id].nameGe;

              labelsGroup.appendChild(label);

              // Add event listeners
              path.addEventListener("click", () => handleRegionClick(id));
              path.addEventListener("mouseenter", () => handleRegionHover(id));
              path.addEventListener("mouseleave", handleRegionLeave);
            }
          });
        }
      } catch (error) {
        console.error("Failed to load or process the SVG:", error);
        setError("Failed to load map data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSvg();

    return () => {
      const mapContainer = document.getElementById("georgia-map-container");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, [
    handleRegionClick,
    handleRegionHover,
    handleRegionLeave,
    isEnglish,
    memoizedRegionData,
  ]);

  // Highlight hovered region
  useEffect(() => {
    if (!svgRef.current || !hoveredRegion) return;

    const svgElement = svgRef.current;
    const paths = svgElement.querySelectorAll(".map-paths path");
    const labels = svgElement.querySelectorAll(".map-labels .region-label");

    paths.forEach((path) => {
      if (path.getAttribute("id") === hoveredRegion) {
        path.classList.add("highlighted");
      } else {
        path.classList.remove("highlighted");
      }
    });

    labels.forEach((label) => {
      if (label.getAttribute("data-region") === hoveredRegion) {
        label.classList.add("highlighted");
      } else {
        label.classList.remove("highlighted");
      }
    });
  }, [hoveredRegion]);

  return (
    <div className="h-full bg-transparent relative">
      <div className="h-full p-2 md:p-4 lg:p-6">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-10">
            <div className="animate-pulse text-gray-500">Loading map...</div>
          </div>
        )}

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
              aria-label="Interactive map of Georgia"
              role="img"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
