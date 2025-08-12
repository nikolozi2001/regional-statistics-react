import React, { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import mapIcon from "../assets/images/map-200-b.png";
import populationIcon from "../assets/images/population-200-p.png";
import lineChartIcon from "../assets/images/line-chart-200-r.png";
import userIcon from "../assets/images/user-200-y.png";
import areaChartIcon from "../assets/images/area-chart-200-g.png";
import pieChartIcon from "../assets/images/pie-chart-200-b.png";
import suitcaseIcon from "../assets/images/suitcase-200-p.png";

const MainInfo = () => {
  const { isEnglish } = useLanguage();
  const [mainInfoData, setMainInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Icon mapping based on the ID from the API
  const iconMap = {
    1: mapIcon, // ფართობი / Area
    2: populationIcon, // მოსახლეობა / Population
    3: lineChartIcon, // მშპ-ს რეალური ზრდა / GDP Real Growth Rate
    4: userIcon, // მშპ ერთ სულ მოსახლეზე / GDP Per Capita
    5: areaChartIcon, // ინფლაცია / Inflation
    6: pieChartIcon, // უმუშევრობის დონე / Unemployment Rate
    7: suitcaseIcon, // რეგისტრირებული ეკონომიკური სუბიექტები / Business Entities
  };

  // Unit mapping for different data types
  const getDataWithUnit = (item) => {
    switch (item.id) {
      case 1: // Area
        return `${item.data} ${isEnglish ? "sq. km" : "კვ. კმ"}`;
      case 2: // Population
        return `${item.data} ${isEnglish ? "thousand" : "ათასი"}`;
      case 4: // GDP Per Capita
        return `${item.data} ${isEnglish ? "USD" : "აშშ დოლარი"}`;
      case 7: // Business Entities
        return item.data;
      default:
        return item.data;
    }
  };

  // Get tooltip text based on language
  const getTooltipText = (item) => {
    const tooltip = isEnglish ? item.tooltip_en : item.tooltip_ge;
    return tooltip || null;
  };

  // Handle mouse enter for tooltip
  const handleMouseEnter = (item, event) => {
    const tooltip = getTooltipText(item);
    if (tooltip) {
      setHoveredItem(item);
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  // Handle mouse leave for tooltip
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (event) => {
    if (hoveredItem) {
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  useEffect(() => {
    const fetchMainInfo = async () => {
      try {
        setLoading(true);
        const language = isEnglish ? "en" : "ge";
        const response = await fetch(
          `http://192.168.1.27:8080/api/mainInfo?language=${language}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch main info data");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setMainInfoData(result.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching main info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMainInfo();
  }, [isEnglish]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border-r border-gray-200">
        <div className="text-lg text-gray-500 text-center">
          {isEnglish ? "Loading..." : "იტვირთება..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border-r border-gray-200">
        <div className="text-base text-red-500 text-center p-4">
          {isEnglish
            ? "Error loading data"
            : "მონაცემების ჩატვირთვისას შეცდომა"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 overflow-y-auto relative">
      <div className="p-3 md:p-6 flex flex-col gap-3 md:gap-4">
        {mainInfoData.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 md:p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            id={`textbox${item.id}`}
            onMouseEnter={(e) => handleMouseEnter(item, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3 flex-shrink-0"
              src={iconMap[item.id]}
              alt={isEnglish ? item.title_en : item.title_ge}
            />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="text-xs md:text-sm text-gray-700 font-bold leading-tight">
                {isEnglish ? item.title_en : item.title_ge}:
              </div>
              <div className="text-xs md:text-sm text-gray-800 font-bold leading-tight break-words">
                {getDataWithUnit(item)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredItem && getTooltipText(hoveredItem) && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 35}px`,
            transform:
              tooltipPosition.x > window.innerWidth - 200
                ? "translateX(-100%)"
                : "none",
          }}
        >
          {getTooltipText(hoveredItem)}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default MainInfo;
