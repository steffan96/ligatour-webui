import axiosInstance from "../router/axios";

export interface PlayerInterface {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	competition_id: number;
	team_id: number;
	position: string;
	profile_picture: string;
	created_at: string;
}

export const createPlayer = async (data: Partial<PlayerInterface>) => {
	try {
		const response = await axiosInstance.post("/api/v1/players", data);
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to create player.";
	}
};

export const getPlayer = async (playerId: string) => {
	try {
		const response = await axiosInstance.get(`/api/v1/players/${playerId}`);
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch player.";
	}
};

export const listPlayers = async () => {
	try {
		const response = await axiosInstance.get("/api/v1/players");
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch players.";
	}
};

export const updatePlayer = async (
	playerId: string,
	data: Partial<PlayerInterface>,
) => {
	try {
		const response = await axiosInstance.put(
			`/api/v1/players/${playerId}`,
			data,
		);
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to update player.";
	}
};

export const deletePlayer = async (playerId: string) => {
	try {
		const response = await axiosInstance.delete(`/api/v1/players/${playerId}`);
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to delete player.";
	}
};
