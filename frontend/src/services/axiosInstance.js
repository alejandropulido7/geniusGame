import axios from 'axios';
import { getCookie } from '../utils/cookies';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, // Replace with your API URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage or context
    const token = getCookie('token'); // or use context if necessary
    console.l
    // If token is present, add it to the request headers
    if (token) {
      config.headers.token = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;