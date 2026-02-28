import axiosInstance from '../router/axios';

export interface CompetitionInterface {
  id: number;
  user_id: number;
  name: string;
  logo: string;
  type: string;
  status: string;
  created_at: string;
  current_round: number;
  number_of_teams: number;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  has_third_place: boolean;
  two_legged: boolean;
  number_of_groups: number;
  teams_per_group: number;
}

export const createCompetition = async (name: string, type: string) => {
	const payload = {name, type};
	const response = await axiosInstance.post('/api/v1/competitions', payload);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const listCompetitions = async () => {
	const response = await axiosInstance.get('/api/v1/competitions');
	if (response && response.data) {
		return response.data;
	}
	return [];
};

export const getCompetition = async (id: number) => {
	const response = await axiosInstance.get(`/api/v1/competitions/${id}`);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const updateCompetition = async (id: number, updates: { name?: string; type?: string }) => {
	const response = await axiosInstance.put(`/api/v1/competitions/${id}`, updates);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const deleteCompetition = async (id: number) => {
	const response = await axiosInstance.delete(`/api/v1/competitions/${id}`);
	if (response && response.status === 204) {
		return true;
	}
	return false;
};

export const getCompetitionTeams = async (competitionId: string) => {
  const response = await axiosInstance.get(`/api/v1/competitions/${competitionId}/teams`);
  if (response && response.data) {
    return response.data;
  }
  return [];
};

export const addTeamToCompetition = async (competitionId: string, teamId: string) => {
  const response = await axiosInstance.post(`/api/v1/competitions/${competitionId}/teams`, { team_id: teamId });
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const removeTeamFromCompetition = async (competitionId: string, teamId: string) => {
  const response = await axiosInstance.delete(`/api/v1/competitions/${competitionId}/teams/${teamId}`);
  if (response && response.status === 204) {
    return true;
  }
  return false;
};
