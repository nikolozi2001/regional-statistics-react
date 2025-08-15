import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Select from "react-select";
import geoMapsImage from "../assets/images/reg_photos/geomaps.png";
import chartsImage from "../assets/images/reg_photos/1612523122750-Charts.jpg";
import excelIcon from "../assets/excel.png";

const RegionComp = () => {
  const { language } = useLanguage();
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Translations
  const translations = {
    EN: {
      pageTitle: "Comparison of Key Indicators by Regions of Georgia",
      chooseRegions: "Choose Regions",
      chooseIndicators: "Choose Indicators",
      search: "Search",
      download: "Download",
      selectOptions: "Select Options",
      area: "Area (sq. km)",
      population: "The Number of Population (thousands)",
      liveBirths: "Number of live births (persons):",
      deaths: "Number of deaths (persons)",
      naturalIncrease: "Natural Increase (persons)",
      gdp: "Gross Domestic Product (Mil. GEL)",
      gdpPerCapita: "Gross Domestic Product per capita (USD)",
      unemploymentRate: "Unemployment Rate (percentage)",
      employed: "Employed (thousand person)",
      employmentBusiness:
        "Employment Level in Business Sector (thousand person)",
      averageSalary: "Average monthly remuneration of employed persons (GEL)",
      registeredEntities: "The Number of Registered Business Entities (unit)",
      activeEntities: "Number of active economic entities (units):",
      newlyRegistered: "Number of newly registered economic entities (units):",
    },
    GE: {
      pageTitle:
        "ძირითადი მაჩვენებლების შედარება საქართველოს რეგიონების მიხედვით",
      chooseRegions: "აირჩიეთ რეგიონები",
      chooseIndicators: "აირჩიეთ მაჩვენებლები",
      search: "ძიება",
      download: "გადმოწერა",
      selectOptions: "აირჩიეთ პარამეტრები",
      area: "ფართობი (კვ.კმ)",
      population: "მოსახლეობის რიცხოვნობა (ათასი)",
      liveBirths: "ცოცხლად დაბადებულთა რიცხოვნობა (კაცი):",
      deaths: "გარდაცვლილთა რიცხოვნობა (კაცი):",
      naturalIncrease: "ბუნებრივი მატება (კაცი):",
      gdp: "მთლიანი შიდა პროდუქტი (მლნ. ლარი)",
      gdpPerCapita: "მთლიანი შიდა პროდუქტი ერთ სულ მოსახლეზე (აშშ დოლარი)",
      unemploymentRate: "უმუშევრობის დონე (%)",
      employed: "დასაქმებულთა რაოდენობა, სულ (ათასი კაცი)",
      employmentBusiness:
        "დასაქმებულთა რაოდენობა - ბიზნეს სექტორში (ათასი კაცი)",
      averageSalary:
        "დასაქმებულთა საშუალოთვიური ხელფასი - ბიზნეს სექტორში (ლარი)",
      registeredEntities:
        "რეგისტრირებული ეკონომიკური სუბიექტების რაოდენობა (ერთეული)",
      activeEntities: "მოქმედი ეკონომიკური სუბიექტების რაოდენობა (ერთეული)",
      newlyRegistered:
        "ახლადრეგისტრირებული ეკონომიკური სუბიექტების რაოდენობა (ერთეული)",
    },
  };

  const t = translations[language] || translations.GE;

  // Generate key indicators options
  const keyIndicatorOptions = useMemo(() => {
    const indicatorKeys = [
      "area",
      "population",
      "liveBirths",
      "deaths",
      "naturalIncrease",
      "gdp",
      "gdpPerCapita",
      "unemploymentRate",
      "employed",
      "employmentBusiness",
      "averageSalary",
      "registeredEntities",
      "activeEntities",
      "newlyRegistered",
    ];

    const options = indicatorKeys.map((key, index) => ({
      value: index + 1,
      label: t[key],
      key: key,
    }));

    // Add "Select All" option at the beginning
    return [
      {
        value: "all",
        label: language === "EN" ? "Select All" : "ყველას არჩევა",
      },
      ...options,
    ];
  }, [t, language]);

  // Fetch regions data
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://192.168.1.27:8080/api/regions");
        const data = await response.json();

        if (data.success) {
          const regionsData = data.data.map((region) => ({
            value: region.ID,
            label: language === "EN" ? region.NameEN : region.Name,
            ...region,
          }));

          // Sort regions alphabetically by label
          const sortedRegions = regionsData.sort((a, b) =>
            a.label.localeCompare(b.label, language === "GE" ? "ka" : "en")
          );

          // Add "Select All" option at the beginning
          const regionsWithSelectAll = [
            {
              value: "all",
              label: language === "EN" ? "Select All" : "ყველას არჩევა",
            },
            ...sortedRegions,
          ];

          setRegions(regionsWithSelectAll);
        } else {
          throw new Error("Failed to fetch regions");
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        // Fallback data for demonstration
        const fallbackRegions = [
          { value: 1, label: language === "EN" ? "Tbilisi" : "თბილისი" },
          { value: 2, label: language === "EN" ? "Adjara" : "აჭარა" },
          { value: 3, label: language === "EN" ? "Guria" : "გურია" },
          { value: 4, label: language === "EN" ? "Imereti" : "იმერეთი" },
          { value: 5, label: language === "EN" ? "Kakheti" : "კახეთი" },
          {
            value: 6,
            label: language === "EN" ? "Samtskhe-Javakheti" : "სამცხე-ჯავახეთი",
          },
          {
            value: 7,
            label: language === "EN" ? "Kvemo Kartli" : "ქვემო ქართლი",
          },
          {
            value: 8,
            label: language === "EN" ? "Shida Kartli" : "შიდა ქართლი",
          },
          {
            value: 9,
            label: language === "EN" ? "Mtskheta-Mtianeti" : "მცხეთა-მთიანეთი",
          },
          {
            value: 10,
            label:
              language === "EN"
                ? "Racha-Lechkhumi and Kvemo Svaneti"
                : "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
          },
          {
            value: 11,
            label:
              language === "EN"
                ? "Samegrelo-Zemo Svaneti"
                : "სამეგრელო-ზემო სვანეთი",
          },
        ];

        // Sort fallback regions alphabetically by label
        const sortedFallbackRegions = fallbackRegions.sort((a, b) =>
          a.label.localeCompare(b.label, language === "GE" ? "ka" : "en")
        );

        // Add "Select All" option at the beginning
        const fallbackWithSelectAll = [
          {
            value: "all",
            label: language === "EN" ? "Select All" : "ყველას არჩევა",
          },
          ...sortedFallbackRegions,
        ];

        setRegions(fallbackWithSelectAll);
      }
    };

    fetchRegions();
  }, [language]);

  // Handle region selection with "Select All" functionality
  const handleRegionChange = (selected) => {
    if (!selected || selected.length === 0) {
      setSelectedRegions([]);
      return;
    }

    const selectAllOption = selected.find((option) => option.value === "all");
    const previousSelectAll = selectedRegions.find(
      (option) => option.value === "all"
    );

    if (selectAllOption && !previousSelectAll) {
      // "Select All" was just selected - select all regions except the "Select All" option itself
      const allRegions = regions.filter((region) => region.value !== "all");
      setSelectedRegions(allRegions);
    } else if (!selectAllOption && previousSelectAll) {
      // "Select All" was just deselected - clear all
      setSelectedRegions([]);
    } else {
      // Normal selection - filter out the "Select All" option
      const filteredSelection = selected.filter(
        (option) => option.value !== "all"
      );
      setSelectedRegions(filteredSelection);
    }
  };

  // Handle indicator selection with "Select All" functionality
  const handleIndicatorChange = (selected) => {
    if (!selected || selected.length === 0) {
      setSelectedIndicators([]);
      return;
    }

    const selectAllOption = selected.find((option) => option.value === "all");
    const previousSelectAll = selectedIndicators.find(
      (option) => option.value === "all"
    );

    if (selectAllOption && !previousSelectAll) {
      // "Select All" was just selected - select all indicators except the "Select All" option itself
      const allIndicators = keyIndicatorOptions.filter(
        (indicator) => indicator.value !== "all"
      );
      setSelectedIndicators(allIndicators);
    } else if (!selectAllOption && previousSelectAll) {
      // "Select All" was just deselected - clear all
      setSelectedIndicators([]);
    } else {
      // Normal selection - filter out the "Select All" option
      const filteredSelection = selected.filter(
        (option) => option.value !== "all"
      );
      setSelectedIndicators(filteredSelection);
    }
  };

  // Handle search/comparison
  const handleSearch = async () => {
    if (selectedRegions.length === 0 || selectedIndicators.length === 0) {
      alert(
        language === "EN"
          ? "Please select both regions and indicators"
          : "გთხოვთ აირჩიოთ რეგიონები და მაჩვენებლები"
      );
      return;
    }

    setLoading(true);
    try {
      // Use the regions data we already have from the API
      const formattedData = formatComparisonData(regions);
      setComparisonData(formattedData);
      setShowTable(true);
    } catch (error) {
      console.error("Error creating comparison data:", error);
      alert(
        language === "EN"
          ? "Error creating comparison table"
          : "შედარების ცხრილის შექმნისას მოხდა შეცდომა"
      );
    } finally {
      setLoading(false);
    }
  };

  // Format real API data for table display
  const formatComparisonData = (allRegionsData) => {
    const data = [];

    // Header row with region names
    const headerRow = [""];
    selectedRegions.forEach((region) => {
      headerRow.push(region.label);
    });
    data.push(headerRow);

    // Data rows for each selected indicator
    selectedIndicators.forEach((indicator) => {
      const row = [indicator.label];

      selectedRegions.forEach((region) => {
        // Find the region data, excluding the "Select All" option
        const regionData = allRegionsData.find(
          (item) => item.value === region.value && item.value !== "all"
        );
        if (regionData) {
          // Map indicator to field name and get value
          const fieldValue = getFieldValueByIndicator(
            regionData,
            indicator.key
          );
          row.push(fieldValue || "N/A");
        } else {
          row.push("N/A");
        }
      });

      data.push(row);
    });

    return data;
  };

  // Helper function to get field value by indicator key
  const getFieldValueByIndicator = (regionData, indicatorKey) => {
    const fieldMap = {
      area: "Area",
      population: "Population",
      liveBirths: "liveBirth",
      deaths: "death",
      naturalIncrease: "naturalIncrease",
      gdp: "GDP",
      gdpPerCapita: "GDPPerCapita",
      unemploymentRate: "UnemploymentRate",
      employed: "EmploymentRate",
      employmentBusiness: "EmploymentRateIndustry",
      averageSalary: "AverageSalaryIndustry",
      registeredEntities: "RegistredEntities",
      activeEntities: "activeEntities",
      newlyRegistered: "newlyRegistredEntities",
    };

    const fieldName = fieldMap[indicatorKey];
    return fieldName ? regionData[fieldName] : null;
  };

  // Handle export to Excel
  const handleExport = () => {
    if (!showTable || comparisonData.length === 0) {
      alert(
        language === "EN" ? "No data to export" : "გასატანი მონაცემები არ არის"
      );
      return;
    }

    // Create CSV content
    const csvContent = comparisonData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "regional_comparison.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#667eea" : "#e2e8f0",
      borderWidth: "2px",
      borderRadius: "10px",
      padding: "4px",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(102, 126, 234, 0.1)"
        : "0 2px 8px rgba(0, 0, 0, 0.1)",
      "&:hover": {
        borderColor: "#cbd5e0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#667eea",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      opacity: "0.8",
      borderRadius: "0 6px 6px 0",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor:
        state.data.value === "all"
          ? state.isFocused
            ? "#e0e7ff"
            : "#f3f4f6"
          : state.isFocused
          ? "#e0e7ff"
          : "white",
      color: state.data.value === "all" ? "#4c51bf" : "#374151",
      fontWeight: state.data.value === "all" ? "600" : "400",
      borderBottom: state.data.value === "all" ? "1px solid #e5e7eb" : "none",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.data.value === "all" ? "#e0e7ff" : "#f3f4f6",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            {t.pageTitle}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Selection Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Regions Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t.chooseRegions}
              </h3>
              <div className="mb-4">
                <Select
                  isMulti
                  options={regions}
                  value={selectedRegions}
                  onChange={handleRegionChange}
                  placeholder={t.selectOptions}
                  styles={selectStyles}
                  className="text-left"
                  classNamePrefix="react-select"
                />
              </div>
              <img
                src={geoMapsImage}
                alt="Georgia Map"
                className="w-full max-w-md mx-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>
          </div>

          {/* Indicators Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t.chooseIndicators}
              </h3>
              <div className="mb-4">
                <Select
                  isMulti
                  options={keyIndicatorOptions}
                  value={selectedIndicators}
                  onChange={handleIndicatorChange}
                  placeholder={t.selectOptions}
                  styles={selectStyles}
                  className="text-left"
                  classNamePrefix="react-select"
                />
              </div>
              <img
                src={chartsImage}
                alt="Charts"
                className="w-full max-w-md mx-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl 
                     transition-all duration-300 transform hover:scale-105 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     disabled:from-gray-400 disabled:to-gray-500"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                {language === "EN" ? "Loading..." : "იტვირთება..."}
              </div>
            ) : (
              t.search
            )}
          </button>
        </div>

        {/* Comparison Table */}
        {showTable && comparisonData.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <tbody>
                  {comparisonData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={
                        rowIndex === 0
                          ? ""
                          : "hover:bg-gray-50/50 transition-colors duration-200"
                      }
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`px-4 py-3 border-b border-gray-200/50 ${
                            rowIndex === 0
                              ? "font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600"
                              : cellIndex === 0
                              ? "font-medium text-white bg-gradient-to-r from-pink-400 to-red-500"
                              : "text-gray-600"
                          } ${cellIndex === 0 ? "text-left" : "text-right"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export Button */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-200/50">
              <div className="flex justify-center">
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                           text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl 
                           transition-all duration-300 transform hover:scale-105 active:scale-95
                           flex items-center gap-2"
                >
                  <img src={excelIcon} alt="Excel" className="w-5 h-5" />
                  {t.download}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionComp;
