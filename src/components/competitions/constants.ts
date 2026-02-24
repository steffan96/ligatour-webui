enum CompetitionType {
    ROUND_ROBIN = 'round_robin',
    KNOCKOUT = 'knockout',
    GROUP_STAGE = 'group_stage',
    SWISS = 'swiss'
}

const CompetitionTypeDisplay: Record<CompetitionType, string> = {
    [CompetitionType.ROUND_ROBIN]: 'Round Robin',
    [CompetitionType.KNOCKOUT]: 'Knockout',
    [CompetitionType.GROUP_STAGE]: 'Group Stage',
    [CompetitionType.SWISS]: 'Swiss System'
};

export { CompetitionType, CompetitionTypeDisplay };
