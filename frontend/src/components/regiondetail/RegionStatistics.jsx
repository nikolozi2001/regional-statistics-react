import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const RegionStatistics = ({ municipalNames }) => {
  const { isEnglish } = useLanguage();

  return (
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
  );
};

export default RegionStatistics;
