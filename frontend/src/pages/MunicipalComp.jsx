import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Select from "react-select";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import Header from "../components/Header";
import { apiService } from "../services/api";
import geoMapsImage from "../assets/images/reg_photos/geomaps.png";
import chartsImage from "../assets/images/reg_photos/1612523122750-Charts.jpg";
import excelIcon from "../assets/excel.png";

const MunicipalComp = () => {
  const { language } = useLanguage();
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipalityIds, setSelectedMunicipalityIds] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Convert language format for API and UI comparisons
  const isEnglish = language === "EN";
  const apiLanguage = language === "EN" ? "en" : "ge";

  // Compute selected municipalities from IDs and current municipalities list
  const selectedMunicipalities = useMemo(() => {
    return selectedMunicipalityIds.map(id => 
      municipalities.find(municipality => municipality.value === id)
    ).filter(Boolean);
  }, [selectedMunicipalityIds, municipalities]);

  // Translations
  const translations = {
    EN: {
      pageTitle: "Comparison of Key Indicators by Municipalities of Georgia",
      chooseMunicipalities: "Choose Municipalities",
      chooseIndicators: "Choose Indicators",
      search: "Search",
      download: "Download",
      selectOptions: "Select Options",
      area: "Area (sq. km)",
      numberOfCT: "Number of cities and boroughs (units)",
      villages: "Number of villages (units)",
      population: "Number of Population (thousands)",
      liveBirths: "Number of live births (persons)",
      generalBirthRate: "Crude birth rate (per 1 000 population)",
      dead: "Number of deaths (persons)",
      generalMortalityRate: "Crude death rate (per 1 000 population)",
      naturalIncrease: "Natural Increase (persons)",
      employees: "Employment level in Business Sector (thousand person)",
      avgSalary: "Average monthly remuneration of employed persons-in business sector (GEL)",
      regEcSub: "The Number of Registered Business Entities (units)",
      actEcSub: "Number of active economic subjects (units)",
      newlyEcEnt: "Number of newly registered economic entities (units):",
    },
    GE: {
      pageTitle: "ძირითადი მაჩვენებლების შედარება საქართველოს მუნიციპალიტეტების მიხედვით",
      chooseMunicipalities: "აირჩიეთ მუნიციპალიტეტები",
      chooseIndicators: "აირჩიეთ მაჩვენებლები", 
      search: "ძიება",
      download: "გადმოწერა",
      selectOptions: "აირჩიეთ პარამეტრები",
      area: "ფართობი (კვ.კმ)",
      numberOfCT: "ქალაქების და დაბების რაოდენობა (ერთეული)",
      villages: "სოფლების რაოდენობა (ერთეული)",
      population: "მოსახლეობის რიცხოვნობა (ათასი)",
      liveBirths: "ცოცხლად დაბადებულთა რიცხოვნობა (კაცი)",
      generalBirthRate: "შობადობის ზოგადი კოეფიციენტი (დაბადებულთა რიცხოვნობა მოსახლეობის 1000 კაცზე)",
      dead: "გარდაცვლილთა რიცხოვნობა (კაცი)",
      generalMortalityRate: "მოკვდაობის ზოგადი კოეფიციენტი (გარდაცვლილთა რიცხოვნობა მოსახლეობის 1000 კაცზე)",
      naturalIncrease: "ბუნებრივი მატება (კაცი)",
      employees: "დასაქმებულთა რაოდენობა-ბიზნეს სექტორში (ათასი კაცი)",
      avgSalary: "დასაქმებულთა საშუალოთვიური ხელფასი-ბიზნეს სექტორში (ლარი)",
      regEcSub: "რეგისტრირებული ეკონომიკური სუბიექტების რაოდენობა (ერთეული)",
      actEcSub: "მოქმედი ეკონომიკური სუბიექტების რაოდენობა (ერთეული)",
      newlyEcEnt: "ახლად რეგისტრირებული სუბიექტების რაოდენობა (ერთეული)",
    },
  };

  const t = translations[language] || translations.GE;

  // Generate key indicators options
  const keyIndicatorOptions = useMemo(() => {
    const indicatorKeys = [
      "area",
      "numberOfCT",
      "villages",
      "population",
      "liveBirths",
      "generalBirthRate",
      "dead",
      "generalMortalityRate",
      "naturalIncrease",
      "employees",
      "avgSalary",
      "regEcSub",
      "actEcSub",
      "newlyEcEnt",
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
        label: isEnglish ? "Select All" : "ყველას არჩევა",
      },
      ...options,
    ];
  }, [t, isEnglish]);

  // Fetch municipalities data from API
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMunicipalities(apiLanguage);
        if (response.success) {
          const municipalitiesData = response.data.map((municipality) => ({
            value: municipality.id,
            label: municipality.name,
            ...municipality,
          }));

          // Sort municipalities alphabetically by label
          const sortedMunicipalities = municipalitiesData.sort((a, b) =>
            a.label.localeCompare(b.label, language === "EN" ? "en" : "ka")
          );

          // Add "Select All" option at the beginning
          const municipalitiesWithSelectAll = [
            {
              value: "all",
              label: isEnglish ? "Select All" : "ყველას არჩევა",
            },
            ...sortedMunicipalities,
          ];

          setMunicipalities(municipalitiesWithSelectAll);
          // Clear selections when language changes
          setSelectedMunicipalityIds([]);
          setSelectedIndicators([]);
        } else {
          toast.error("Failed to load municipalities");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load municipalities");
        console.error("Error fetching municipalities:", error);
        // Set empty municipalities array on error
        setMunicipalities([
          {
            value: "all",
            label: isEnglish ? "Select All" : "ყველას არჩევა",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, [language, apiLanguage, isEnglish]);

  // Update selected municipalities when language/municipalities change
  useEffect(() => {
    // Clear comparison data when language changes to force refresh
    setComparisonData([]);
    setShowTable(false);
  }, [language]);

  // Handle municipality selection with "Select All" functionality
  const handleMunicipalityChange = (selected) => {
    if (!selected || selected.length === 0) {
      setSelectedMunicipalityIds([]);
      return;
    }

    const selectAllOption = selected.find((option) => option.value === "all");
    const previousSelectAll = selectedMunicipalities.find(
      (option) => option.value === "all"
    );

    if (selectAllOption && !previousSelectAll) {
      // "Select All" was just selected - select all municipalities except the "Select All" option itself
      const allMunicipalityIds = municipalities.filter((municipality) => municipality.value !== "all").map(municipality => municipality.value);
      setSelectedMunicipalityIds(allMunicipalityIds);
    } else if (!selectAllOption && previousSelectAll) {
      // "Select All" was just deselected - clear all
      setSelectedMunicipalityIds([]);
    } else {
      // Normal selection - filter out the "Select All" option and store IDs
      const filteredSelection = selected.filter(
        (option) => option.value !== "all"
      ).map(option => option.value);
      setSelectedMunicipalityIds(filteredSelection);
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
    if (selectedMunicipalities.length === 0 || selectedIndicators.length === 0) {
      toast.error(
        isEnglish
          ? "Please select both municipalities and indicators"
          : "გთხოვთ აირჩიოთ მუნიციპალიტეტები და მაჩვენებლები"
      );
      return;
    }

    setLoading(true);
    try {
      // Use the municipalities data we already have from the API
      const formattedData = formatComparisonData(municipalities);
      setComparisonData(formattedData);
      setShowTable(true);
      toast.success(
        isEnglish
          ? "Comparison table created successfully!"
          : "შედარების ცხრილი წარმატებით შეიქმნა!"
      );
    } catch (error) {
      console.error("Error creating comparison data:", error);
      toast.error(
        isEnglish
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
      case "generalBirthRate":
      case "generalMortalityRate":
        return num.toFixed(2);
      case "avgSalary":
      case "area":
      case "numberOfCT":
      case "villages":
      case "population":
      case "liveBirths":
      case "dead":
      case "naturalIncrease":
      case "employees":
      case "regEcSub":
      case "actEcSub":
      case "newlyEcEnt":
      default:
        return num.toLocaleString("en-US");
    }
  };

  // Format real API data for table display (municipalities as rows, indicators as columns)
  const formatComparisonData = (allMunicipalitiesData) => {
    const data = [];

    // Header row with indicator names
    const headerRow = [""];
    selectedIndicators.forEach((indicator) => {
      headerRow.push(indicator.label);
    });
    data.push(headerRow);

    // Data rows for each selected municipality
    selectedMunicipalities.forEach((municipality) => {
      const row = [municipality.label];

      selectedIndicators.forEach((indicator) => {
        // Find the municipality data, excluding the "Select All" option
        const municipalityData = allMunicipalitiesData.find(
          (item) => item.value === municipality.value && item.value !== "all"
        );
        if (municipalityData) {
          // Map indicator to field name and get value
          const fieldValue = getFieldValueByIndicator(
            municipalityData,
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
  const getFieldValueByIndicator = (municipalityData, indicatorKey) => {
    const fieldMap = {
      area: "area",
      numberOfCT: "numberOfCT",
      villages: "villages",
      population: "population",
      liveBirths: "liveBirths",
      generalBirthRate: "generalBirthRate",
      dead: "dead",
      generalMortalityRate: "generalMortalityRate",
      naturalIncrease: "naturalIncrease",
      employees: "employees",
      avgSalary: "avgSalary",
      regEcSub: "regEcSub",
      actEcSub: "actEcSub",
      newlyEcEnt: "newlyEcEnt",
    };

    const fieldName = fieldMap[indicatorKey];
    return fieldName ? municipalityData[fieldName] : null;
  };

  // Handle export to real Excel file
  const handleExport = async () => {
    if (!showTable || comparisonData.length === 0) {
      toast.error(
        isEnglish ? "No data to export" : "გასატანი მონაცემები არ არის"
      );
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Municipal Comparison");

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
      link.download = "municipal_comparison.xlsx";
      link.click();
      URL.revokeObjectURL(url);

      // Success toast
      toast.success(
        isEnglish
          ? "Excel exported successfully!"
          : "Excel ფაილი წარმატებით იქნა ექსპორტირებული!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        isEnglish ? "Export failed" : "ექსპორტი ვერ მოხერხდა"
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
          {/* Municipalities Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t.chooseMunicipalities}
              </h3>
              <div className="mb-4">
                <Select
                  isMulti
                  isLoading={loading}
                  options={municipalities}
                  value={selectedMunicipalities}
                  onChange={handleMunicipalityChange}
                  placeholder={
                    loading
                      ? isEnglish
                        ? "Loading..."
                        : "იტვირთება..."
                      : t.selectOptions
                  }
                  noOptionsMessage={() =>
                    loading
                      ? isEnglish
                        ? "Loading..."
                        : "იტვირთება..."
                      : isEnglish
                      ? "No municipalities found"
                      : "მუნიციპალიტეტები არ მოიძებნა"
                  }
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
                  noOptionsMessage={() =>
                    isEnglish
                      ? "No indicators found"
                      : "ინდიკატორები არ მოიძებნა"
                  }
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
                {isEnglish ? "Loading..." : "იტვირთება..."}
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

export default MunicipalComp;
