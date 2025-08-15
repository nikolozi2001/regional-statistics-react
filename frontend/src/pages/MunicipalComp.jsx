import React, { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Select from "react-select";
import toast from "react-hot-toast";
import Header from "../components/Header";
import { apiService } from "../services/api";

const MunicipalComp = () => {
  const { language } = useLanguage();
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipalityIds, setSelectedMunicipalityIds] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [loading, setLoading] = useState(false);

  // Convert language format for API and UI comparisons
  const isEnglish = language === "EN";
  const apiLanguage = language === "EN" ? "en" : "ge";

  // Define available indicators based on your table structure
  const indicators = [
    { value: "area", label: isEnglish ? "Area" : "ფართობი" },
    {
      value: "population",
      label: isEnglish ? "Population" : "მოსახლეობა",
    },
    { value: "villages", label: isEnglish ? "Villages" : "სოფლები" },
    {
      value: "liveBirths",
      label: isEnglish ? "Live Births" : "ცოცხლად დაბადებული",
    },
    {
      value: "generalBirthRate",
      label: isEnglish ? "Birth Rate" : "შობადობის კოეფიციენტი",
    },
    { value: "dead", label: isEnglish ? "Deaths" : "გარდაცვლილი" },
    {
      value: "generalMortalityRate",
      label:
        isEnglish ? "Mortality Rate" : "სიკვდილიანობის კოეფიციენტი",
    },
    {
      value: "naturalIncrease",
      label: isEnglish ? "Natural Increase" : "ბუნებრივი მატება",
    },
    {
      value: "employees",
      label: isEnglish ? "Employees" : "დასაქმებულები",
    },
    {
      value: "avgSalary",
      label: isEnglish ? "Average Salary" : "საშუალო ხელფასი",
    },
    {
      value: "regEcSub",
      label:
        isEnglish
          ? "Registered Economic Subjects"
          : "რეგისტრირებული ეკონომიკური სუბიექტები",
    },
    {
      value: "actEcSub",
      label:
        isEnglish
          ? "Active Economic Subjects"
          : "მოქმედი ეკონომიკური სუბიექტები",
    },
    {
      value: "newlyEcEnt",
      label:
        isEnglish
          ? "Newly Registered Entities"
          : "ახლად რეგისტრირებული სუბიექტები",
    },
  ];

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMunicipalities(apiLanguage);
        if (response.success) {
          setMunicipalities(response.data);
          // Clear selections when language changes
          setSelectedMunicipalityIds([]);
          setSelectedIndicators([]);
        } else {
          toast.error("Failed to load municipalities");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load municipalities");
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, [language, apiLanguage]);

  const handleCompare = () => {
    if (selectedMunicipalityIds.length < 2) {
      toast.error(
        isEnglish
          ? "Please select at least 2 municipalities"
          : "გთხოვთ აირჩიოთ მინიმუმ 2 მუნიციპალიტეტი"
      );
      return;
    }

    if (selectedIndicators.length === 0) {
      toast.error(
        isEnglish
          ? "Please select at least one indicator"
          : "გთხოვთ აირჩიოთ მინიმუმ ერთი ინდიკატორი"
      );
      return;
    }

    // TODO: Implement comparison logic
    console.log("Compare municipalities:", selectedMunicipalityIds);
    console.log("With indicators:", selectedIndicators);
  };

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-6">
        {isEnglish
          ? "Municipal Comparison"
          : "მუნიციპალიტეტების შედარება"}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">
            {isEnglish
              ? "Select Municipalities"
              : "აირჩიეთ მუნიციპალიტეტები"}
          </h2>
          <Select
            isMulti
            isLoading={loading}
            options={municipalities.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            value={selectedMunicipalityIds
              .map((id) => {
                const municipality = municipalities.find((m) => m.id === id);
                return municipality
                  ? {
                      value: municipality.id,
                      label: municipality.name,
                    }
                  : null;
              })
              .filter(Boolean)}
            onChange={(selectedOptions) =>
              setSelectedMunicipalityIds(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            placeholder={
              loading
                ? isEnglish
                  ? "Loading..."
                  : "იტვირთება..."
                : isEnglish
                ? "Select municipalities"
                : "აირჩიეთ მუნიციპალიტეტები"
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
          />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">
            {isEnglish ? "Select Indicators" : "აირჩიეთ ინდიკატორები"}
          </h2>
          <Select
            isMulti
            options={indicators}
            value={selectedIndicators}
            onChange={setSelectedIndicators}
            placeholder={
              isEnglish ? "Select indicators" : "აირჩიეთ ინდიკატორები"
            }
            noOptionsMessage={() =>
              isEnglish
                ? "No indicators found"
                : "ინდიკატორები არ მოიძებნა"
            }
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {isEnglish ? "Compare" : "შედარება"}
      </button>
    </div>
  );
};

export default MunicipalComp;
