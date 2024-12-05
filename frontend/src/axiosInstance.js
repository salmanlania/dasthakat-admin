import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

let API_URL = null;
const getBaseURL = async () => {
  if (API_URL) return API_URL;
  const response = await fetch("/gms/config.json");
  const config = await response.json();
  API_URL = config.baseURL;
  return config.baseURL;
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    config.baseURL = await getBaseURL();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      const company_id = localStorage.getItem("company_id");
      const company_branch_id = localStorage.getItem("company_branch_id");
      const login_id = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user_id
        : null;
      config.params = {
        ...config.params,
        company_id,
        company_branch_id,
        login_id,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
