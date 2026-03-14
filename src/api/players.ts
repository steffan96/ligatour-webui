import axiosInstance from './../router/axios'

export const createPlayer = async (data: { first_name: string; last_name: string; email: string }) => {
  const response = await axiosInstance.post('/api/v1/players', data);
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const getPlayer = async (playerId: string) => {
  const response = await axiosInstance.get(`/api/v1/players/${playerId}`);
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const listPlayers = async () => {
  const response = await axiosInstance.get('/api/v1/players')
  if (response && response.data) {
    return response.data
  }
  return []
}

export const updatePlayer = async (
  playerId: string,
  data: { first_name: string; last_name: string; email: string }
) => {
  const response = await axiosInstance.put(`/api/v1/players/${playerId}`, data)
  if (response && response.data) {
    return response.data
  }
  return null
}

export const deletePlayer = async (playerId: string) => {
  const response = await axiosInstance.delete(`/api/v1/players/${playerId}`)
  if (response && response.data) {
    return response.data
  }
  return null
}
