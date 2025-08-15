import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Select from "react-select";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import Header from "./Header";
import geoMapsImage from "../assets/images/reg_photos/geomaps.png";
import chartsImage from "../assets/images/reg_photos/1612523122750-Charts.jpg";
import excelIcon from "../assets/excel.png";

const RegionComp = () => {
  const { language } = useLanguage();
  const [regions, setRegions] = useState([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState([]); // Store only IDs
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Compute selected regions from IDs and current regions list
  const selectedRegions = useMemo(() => {
    return selectedRegionIds.map(id => 
      regions.find(region => region.value === id)
    ).filter(Boolean);
  }, [selectedRegionIds, regions]);

  console.log(regions);
  console.log(selectedIndicators);

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

  // Fetch regions data from API
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
        // Set empty regions array on error
        setRegions([
          {
            value: "all",
            label: language === "EN" ? "Select All" : "ყველას არჩევა",
          },
        ]);
      }
    };

    fetchRegions();
  }, [language]);

  // Update selected regions labels when language/regions change
  useEffect(() => {
    // Clear comparison data when language changes to force refresh
    setComparisonData([]);
    setShowTable(false);
  }, [language]);

  // Handle region selection with "Select All" functionality
  const handleRegionChange = (selected) => {
    if (!selected || selected.length === 0) {
      setSelectedRegionIds([]);
      return;
    }

    const selectAllOption = selected.find((option) => option.value === "all");
    const previousSelectAll = selectedRegions.find(
      (option) => option.value === "all"
    );

    if (selectAllOption && !previousSelectAll) {
      // "Select All" was just selected - select all regions except the "Select All" option itself
      const allRegionIds = regions.filter((region) => region.value !== "all").map(region => region.value);
      setSelectedRegionIds(allRegionIds);
    } else if (!selectAllOption && previousSelectAll) {
      // "Select All" was just deselected - clear all
      setSelectedRegionIds([]);
    } else {
      // Normal selection - filter out the "Select All" option and store IDs
      const filteredSelection = selected.filter(
        (option) => option.value !== "all"
      ).map(option => option.value);
      setSelectedRegionIds(filteredSelection);
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

  // Format number with thousand separators
  const formatNumber = (value, indicatorKey) => {
    if (value === null || value === undefined || value === "N/A") return "N/A";

    // If value is a string with extra text, clean it
    if (typeof value === "string") {
      // Extract numeric portion (supports decimals and commas/spaces)
      const numericMatch = value.replace(/[^\d.,-]/g, "");
      value = numericMatch.replace(",", "."); // normalize decimal separator
    }

    const num = parseFloat(value);
    if (isNaN(num)) return value; // fallback to original if still not a number

    // Format based on indicator type
    switch (indicatorKey) {
      case "unemploymentRate":
      case "gdpPerCapita":
      case "gdp":
      case "averageSalary":
      case "area":
      case "population":
      case "liveBirths":
      case "deaths":
      case "naturalIncrease":
      case "employed":
      case "employmentBusiness":
      case "registeredEntities":
      case "activeEntities":
      case "newlyRegistered":
      default:
        return num.toLocaleString("en-US");
    }
  };

  // Format real API data for table display (regions as rows, indicators as columns)
  const formatComparisonData = (allRegionsData) => {
    const data = [];

    // Header row with indicator names
    const headerRow = [""];
    selectedIndicators.forEach((indicator) => {
      headerRow.push(indicator.label);
    });
    data.push(headerRow);

    // Data rows for each selected region
    selectedRegions.forEach((region) => {
      const row = [region.label];

      selectedIndicators.forEach((indicator) => {
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
          const formattedValue = formatNumber(fieldValue, indicator.key);
          row.push(formattedValue);
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

  // Handle export to real Excel file
  const handleExport = async () => {
    if (!showTable || comparisonData.length === 0) {
      toast.error(
        language === "EN" ? "No data to export" : "გასატანი მონაცემები არ არის"
      );
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Comparison");

      // Add rows
      comparisonData.forEach((row) => worksheet.addRow(row));

      // Header styling
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E3A8A" }, // dark blue
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
      });

      // Column widths + alignment
      worksheet.columns.forEach((col, i) => {
        col.width = 20;
        col.alignment =
          i === 0 ? { horizontal: "left" } : { horizontal: "center" };
      });

      // Export as .xlsx
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "regional_comparison.xlsx";
      link.click();
      URL.revokeObjectURL(url);

      // ✅ Success toast
      toast.success(
        language === "EN"
          ? "Excel exported successfully!"
          : "Excel ფაილი წარმატებით იქნა ექსპორტირებული!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        language === "EN" ? "Export failed" : "ექსპორტი ვერ მოხერხდა"
      );
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
      {/* Header Component */}
      <Header 
        title={t.pageTitle}
        showComparisonButtons={false}
      />

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
                     disabled:from-gray-400 disabled:to-gray-500 cursor-pointer"
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto max-h-[75vh]">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-20">
                  <tr>
                    {comparisonData[0].map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        className={`px-4 py-3 font-semibold text-xs uppercase tracking-wide border-b border-gray-200 bg-gray-50
                  ${
                    cellIndex === 0
                      ? "text-left sticky left-0 z-30 bg-gray-50 text-gray-700 whitespace-nowrap"
                      : "text-center text-gray-600 min-w-[140px]"
                  }`}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.slice(1).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`transition-colors duration-200 ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`px-4 py-3 border-b border-gray-100 
                    ${
                      cellIndex === 0
                        ? "font-medium sticky left-0 z-10 bg-white text-gray-900 text-left whitespace-nowrap"
                        : "text-gray-700 text-center"
                    }`}
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
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-center">
                <button
                  onClick={handleExport}
                  className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-6 
                     rounded-lg shadow-sm hover:shadow-md transition-all duration-200 
                     flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={excelIcon}
                    alt="Excel"
                    className="w-5 h-5 opacity-80"
                  />
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
