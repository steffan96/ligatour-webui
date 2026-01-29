import axios from 'axios';

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

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh-token', { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
