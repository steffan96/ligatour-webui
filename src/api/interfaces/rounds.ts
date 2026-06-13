export interface UpdateRoundPayload {
	status?: "scheduled" | "in_progress" | "completed";
	stage?: string;
}
