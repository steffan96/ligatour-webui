import axiosInstance from "../router/axios";

export interface PlayerInterface {
	first_name: string;
	last_name: string;
	email?: string;
}

export interface TeamInterface {
	id: number;
	name: string;
	logo?: string;
	competition_id?: number;
	skipped_round?: boolean;
	eliminated?: boolean;
	created_at?: string;
	players?: PlayerInterface[] | null;
}

export const createTeam = async (name: string) => {
	try {
		const response = await axiosInstance.post("/api/v1/teams", { name });
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to create participant.";
	}
};

export const getTeam = async (teamId: string) => {
	try {
		const response = await axiosInstance.get(`/api/v1/teams/${teamId}`);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch participant.";
	}
};

export const listTeams = async () => {
	try {
		const response = await axiosInstance.get("/api/v1/teams");
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch participants.";
	}
};

export const updateTeam = async (teamId: string, name: string) => {
	try {
		const response = await axiosInstance.put(`/api/v1/teams/${teamId}`, {
			name,
		});
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || `Failed to update participant.`;
	}
};

export const deleteTeam = async (teamId: string) => {
	try {
		const response = await axiosInstance.delete(`/api/v1/teams/${teamId}`);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to delete participant.";
	}
};

export const addPlayerToTeam = async (teamId: string, player: PlayerInterface) => {
	try {
		const response = await axiosInstance.post(`/api/v1/teams/${teamId}/players`, player);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to add player to team.";
	}
};
