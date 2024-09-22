import { GameDefinitionID } from 'playfulbot-config-loader';
import { DebugArena } from './DebugArena';
import { UserID } from '../entities/Users';
import { TournamentID } from '../entities/Tournaments';

export interface DebugArenaProvider {
  getDebugArena(
    userID: UserID,
    tournamentID: TournamentID,
    gameDefinitionID: GameDefinitionID | undefined
  ): Promise<DebugArena>;

  deleteDebugArena(userID: UserID, tournamentID: TournamentID): Promise<boolean>;
}
