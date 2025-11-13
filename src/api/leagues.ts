import axiosInstance from '../router/axios'

export const createLeague = async (name: string, type: string) => {
  const payload = { name, type };
  const response = await axiosInstance.post('/api/leagues', payload);
  return response.data;
}
