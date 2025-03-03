import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

let API_URL = null;
const getBaseURL = async () => {
  if (API_URL) return API_URL;
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/config.json`);
  const config = await response.json();
  API_URL = config.baseURL;
  if (!config.baseURL) {
    return import.meta.env.VITE_API_URL;
  }
  return config.baseURL;
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    config.baseURL = await getBaseURL();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
