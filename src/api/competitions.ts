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
  individual: boolean;
}

export const createCompetition = async (name: string, type: string, individual: boolean) => {
  try {
    const payload = { name, type, individual };
    const response = await axiosInstance.post('/api/v1/competitions', payload);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to create competition.';
  }
};

export const listCompetitions = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/competitions');
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to fetch competitions.';
  }
};

export const getCompetition = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/v1/competitions/${id}`);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to fetch competition.';
  }
};

export const updateCompetition = async (id: number, updates: Partial<CompetitionInterface>) => {
  try {
    const response = await axiosInstance.put(`/api/v1/competitions/${id}`, updates);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to update competition.';
  }
};

export const deleteCompetition = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/competitions/${id}`);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to delete competition.';
  }
};

export const getCompetitionTeams = async (competitionId: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/competitions/${competitionId}/teams`);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to fetch competition teams.';
  }
};

export const addTeamToCompetition = async (competitionId: string, name: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/competitions/${competitionId}/add-team`,
      { name }
    );
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to add team to competition.';
  }
};

export const addPlayerToCompetition = async (
  competitionId: string,
  player: { first_name: string; last_name: string; email?: string }
) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/competitions/${competitionId}/add-player`,
      player
    );
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to add player to competition.';
  }
};

export const removeTeamFromCompetition = async (competitionId: string, teamId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/competitions/${competitionId}/teams/${teamId}`);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to remove team from competition.';
  }
};


