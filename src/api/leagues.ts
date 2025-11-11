import axiosInstance from '../router/axios'

export const createLeague = async () => {
  const response = await axiosInstance.post('/api/leagues')
  return response.data
}
