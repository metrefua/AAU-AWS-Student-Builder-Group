import axios from 'axios';
import { sanitizeData } from './sanitize.js';

// Base URL for the API, imported from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance for public routes (no authentication required)
const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for the API
  withCredentials: true, // Ensure cookies are sent with the request
});

// Add a request interceptor to sanitize data
publicAxiosInstance.interceptors.request.use(
  (config) => {
    // Sanitize request data if it exists
    if (config.data) {
      config.data = sanitizeData(config.data);
    }
    return config;
  },
  (error) => {
    // Handle errors before they are sent
    return Promise.reject(error);
  },
);

// This instance is used for making unauthenticated requests,
// so no Authorization header is added in this instance.

export { publicAxiosInstance as publicAxios }; // Export the publicAxios instance for use in API calls
