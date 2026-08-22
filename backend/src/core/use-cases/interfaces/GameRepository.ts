import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { ArenaID, GameRunnerId } from '~playfulbot/core/entities/base-types';
import { GameRef, GameRefWithDate } from '~playfulbot/core/entities/GameRef';
import { Game } from '~playfulbot/core/entities/Game';
import { RunnerInfo } from './RunnerInfo';
import { PlayerID } from '~playfulbot/core/entities/Players';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';

export interface GameRepository {
  addGame({ gameDefId, players }: { gameDefId: string, players: PlayerAssignment[], arenaId?: ArenaID, waitUntilStarted?: Boolean }): Promise<GameRef>;
  cancelGame(gameId: GameID): Promise<boolean>;
  cancelGamesForTournament(tournamentId: TournamentID): Promise<void>;
  getFullGame(gameId: GameID): Promise<Game>;
  getArenaLatestGame(arenaId: ArenaID): Promise<GameRefWithDate | undefined>;
  close(): Promise<void>;
  streamArenaGames(arenaId: ArenaID): Promise<AsyncIterable<GameRef>>;
  streamPlayerGames(playerId: PlayerID): Promise<AsyncIterable<GameRef>>;
  getRunnerInfo(runnerId: GameRunnerId): Promise<RunnerInfo | undefined>;
}