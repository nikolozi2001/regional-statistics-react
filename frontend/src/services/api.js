import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Test API connection
  test: () => api.get("/test"),

  // Regions
  getRegions: () => api.get("/regions"),
  getRegionStatistics: (regionId) => api.get(`/regions/${regionId}/statistics`),

  // Statistics
  getAllStatistics: () => api.get("/statistics"),

  // Main Info
  getMainInfo: (language = "ge") => {
    const baseURL = "http://192.168.1.27:8080/api";
    return fetch(`${baseURL}/mainInfo?language=${language}`).then((response) =>
      response.json()
    );
  },

  // Region Statistics
  getRegionStatisticsData: async (language = "ge") => {
    try {
      const baseURL = "http://192.168.1.27:8080/api";
      const langParam = language === "en" || language === true ? "en" : "ge";
      const response = await fetch(
        `${baseURL}/regionStatistics?lang=${langParam}`
      );
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error("Failed to load statistics data");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error("Error fetching statistics data: " + error.message);
    }
  },

  // Key Indicators
  getKeyIndicators: async (language = "ge") => {
    try {
      const baseURL = "http://192.168.1.27:8080/api";
      const response = await fetch(
        `${baseURL}/keyIndicators?language=${language}`
      );
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error("Failed to load key indicators data");
      }
    } catch (error) {
      console.error("Error fetching key indicators:", error);
      throw new Error("Error fetching key indicators data: " + error.message);
    }
  },

  // Regions Data
  getRegionsData: async () => {
    try {
      const baseURL = "http://192.168.1.27:8080/api";
      const response = await fetch(`${baseURL}/regions`);
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error("Failed to load regions data");
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw new Error("Error fetching regions data: " + error.message);
    }
  },

  // Region Statistics Titles
  getRegionStatisticsTitles: async (language = "ge") => {
    try {
      const baseURL = "http://192.168.1.27:8080/api";
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${baseURL}/regionStatistics?lang=${language}&_t=${timestamp}`
      );
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error("Failed to load region statistics titles");
      }
    } catch (error) {
      console.error("Error fetching region statistics titles:", error);
      throw new Error(
        "Error fetching region statistics titles: " + error.message
      );
    }
  },
  // Municipalities
  getMunicipalities: async (lang = "ge") => {
    try {
      const baseURL = "http://192.168.1.27:8080/api";
      const response = await fetch(`${baseURL}/municipalities?lang=${lang}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load municipalities data");
      }

      // Backend now returns 'name' field with the correct language
      const formattedData = data.data.map((element) => ({
        id: element.ID,
        name: element.name, // This will be in the correct language
        nameGe: element.nameGe,
        nameEn: element.nameEn,
        area: element.Area,
        numberOfCT: element.NumberOfCT,
        villages: element.Villages,
        population: element.Population,
        liveBirths: element.LiveBirths,
        generalBirthRate: element.GeneralBirthRate,
        dead: element.Dead,
        generalMortalityRate: element.GeneralMortalityRate,
        naturalIncrease: element.NaturalIncrease,
        employees: element.Employees,
        avgSalary: element.AVGSalary,
        regEcSub: element.RegEcSub,
        actEcSub: element.ActEcSub,
        newlyEcEnt: element.NewlyEcEnt,
      }));

      // console.log("Municipalities loaded:", formattedData);

      return {
        success: true,
        data: formattedData,
      };
    } catch (error) {
      console.error("Error fetching municipalities:", error);
      throw new Error(`Error fetching municipalities data: ${error.message}`);
    }
  },
};

export default api;
