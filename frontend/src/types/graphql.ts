import { GameState } from 'src/types/gameState';
import * as gqlTypes from './graphql-generated';

export * from './graphql-generated'

export type UserID = string;
export type TournamentID = string;
export type PlayerID = string;
export type TeamID = string;
export type GameID = string;
export type GameScheduleID = string;
export type JWToken = string;

export interface Game<GS extends GameState> extends gqlTypes.Game {
  gameState: GS;
}

export interface GameSchedule<GS extends GameState>  extends gqlTypes.GameSchedule {
  game: Game<GS>;
}

export type LiveGame<GS extends GameState> = Game<GS> | gqlTypes.GamePatch;

export function isTeam(userTeamResult: gqlTypes.UserTeamResult): userTeamResult is gqlTypes.Team {
  return (userTeamResult as gqlTypes.Team).__typename === 'Team';
}

export function isUserNotPartOfAnyTeam(result: gqlTypes.UserTeamResult): result is gqlTypes.UserNotPartOfAnyTeam {
  return (result as gqlTypes.UserNotPartOfAnyTeam).__typename === 'UserNotPartOfAnyTeam';
}
