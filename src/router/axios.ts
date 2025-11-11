import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  //withCredentials: true,
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') //TODO use httpOnly cookie instead of localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
