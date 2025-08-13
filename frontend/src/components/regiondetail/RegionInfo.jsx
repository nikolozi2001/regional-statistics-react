import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const RegionInfo = ({ region, regionId }) => {
  const { isEnglish } = useLanguage();

  // Get region name based on language
  const regionName = region
    ? isEnglish === "EN"
      ? region.nameEn
      : region.nameGe
    : "Unknown Region";

  return (
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
          <p className="font-medium text-gray-900">{regionId}</p>
        </div>
      </div>
    </div>
  );
};

export default RegionInfo;
