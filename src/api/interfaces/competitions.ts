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
