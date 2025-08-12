import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Test API connection
  test: () => api.get('/test'),

  // Regions
  getRegions: () => api.get('/regions'),
  getRegionStatistics: (regionId) => api.get(`/regions/${regionId}/statistics`),

  // Statistics
  getAllStatistics: () => api.get('/statistics'),
};

export default api;
