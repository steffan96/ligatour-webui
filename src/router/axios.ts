import axios from 'axios';
import { logoutUser } from '../api/auth';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  withCredentials: true,
  validateStatus: (status) => status < 400,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // TODO use httpOnly cookie instead of localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    throw error;
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest.url.includes('/api/auth/refresh-token')) {
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axiosInstance.post('/api/auth/refresh-token', {
          refresh_token: refreshToken,
        });
        if (response && response.data) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
