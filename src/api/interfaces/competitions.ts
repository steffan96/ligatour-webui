enum CompetitionType {
	ROUND_ROBIN = "round_robin",
	KNOCKOUT = "knockout",
	SWISS = "swiss",
}

const CompetitionTypeDisplay: Record<CompetitionType, string> = {
	[CompetitionType.ROUND_ROBIN]: "Round Robin",
	[CompetitionType.KNOCKOUT]: "Knockout",
	[CompetitionType.SWISS]: "Swiss System",
};

export { CompetitionType, CompetitionTypeDisplay };
