import axiosInstance from "../router/axios";

export const startRound = async (competitionId: number) => {
	try {
		const response = await axiosInstance.post(
			`/api/v1/rounds/${competitionId}/start-rounds`,
		);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to create round.";
	}
};

export const getRound = async (competitionId: number, roundId: number) => {
	try {
		const response = await axiosInstance.get(
			`/api/v1/rounds/${competitionId}/${roundId}`,
		);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch round.";
	}
};

export const listRounds = async (competitionId: number) => {
	try {
		const response = await axiosInstance.get(`/api/v1/rounds/${competitionId}`);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to fetch rounds.";
	}
};

interface UpdateRoundPayload {
	status?: "scheduled" | "in_progress" | "completed";
	stage?: string;
}

export const updateRound = async (
	competitionId: number,
	roundId: number,
	data: UpdateRoundPayload,
) => {
	try {
		const response = await axiosInstance.put(
			`/api/v1/rounds/${competitionId}/${roundId}`,
			data,
		);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to update round.";
	}
};

export const deleteRound = async (competitionId: number, roundId: number) => {
	try {
		const response = await axiosInstance.delete(
			`/api/v1/rounds/${competitionId}/${roundId}`,
		);
		return response;
	} catch (error: any) {
		if (error.response?.data?.message) {
			throw error.response.data.message;
		}
		throw error.message || "Failed to delete round.";
	}
};
