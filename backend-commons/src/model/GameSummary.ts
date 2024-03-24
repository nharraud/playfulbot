import { GameID } from './Game';
import { RoundID } from './Round';
import { TeamID } from './Team';

/* eslint-disable camelcase */
export interface DbGameSummary {
  id: GameID;
  round_id: RoundID;
}

export interface DbPlayingTeam {
  team_id: TeamID;
  winner: boolean;
}
/* eslint-enable */
