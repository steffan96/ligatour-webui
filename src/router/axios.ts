import axios from 'axios';
import { useToastStore } from '../api/stores/useToastStore';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
	responseType: 'json',
	withCredentials: true,
});

axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token'); // TODO use httpOnly cookie instead of localStorage

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	async error => {
		throw error;
	},
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop: do not retry refresh-token endpoint
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post('/api/auth/refresh-token', { refresh_token: refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (error: any) {
        if ( error.config?.url?.includes('/auth/refresh-token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // window.location.href = '/login';
          // const { showToast } = useToastStore();
          // showToast('Session expired. Please log in again.', false);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
