import axios from 'axios';

// Create a new axios instance for open API requests
const apiNoToken = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// Set base URL directly or based on environment variable
let API_URL = null;

const getBaseURL = async () => {
  if (API_URL) return API_URL;
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/config.json`);
  const config = await response.json();
  if (!config.baseURL) {
    API_URL = import.meta.env.VITE_API_URL;
    return import.meta.env.VITE_API_URL;
  }
  API_URL = config.baseURL;
  return config.baseURL;
};

// Update the base URL dynamically before every request
apiNoToken.interceptors.request.use(
  async (config) => {
    config.baseURL = await getBaseURL();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiNoToken;
