// import { newDebugGameResolver } from "~playfulbot/graphqlResolvers/game";
import { v4 as uuidv4 } from 'uuid';
import {
  DbGameSchedule,
  DbGame,
  UserID,
  DbPlayer,
  DbPlayerAssignment,
  GameScheduleID,
} from '~playfulbot/types/database';

import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication';
import { init } from '~playfulbot/games/tictactoe';
import GameState from '~playfulbot/games/tictactoe/GameState';

const games = new Map<string, DbGame<GameState>>();
const debugGames = new Map<UserID, DbGame<GameState>>();
const debugGameSchedules = new Map<UserID, DbGameSchedule<GameState>>();

function createNewGame(
  gameScheduleID: GameScheduleID,
  playerAssignments: DbPlayerAssignment[]
): DbGame<GameState> {
  const id = uuidv4();
  const game = {
    id,
    version: 0,
    assignments: playerAssignments,
    gameState: init(),
    gameSchedules: [gameScheduleID],
  };
  games.set(game.id, game);
  return game;
}

function createNewPlayers(gameScheduleID: string, nbplayers: number): DbPlayer[] {
  const result: DbPlayer[] = [];
  for (let idx = 0; idx < nbplayers; idx += 1) {
    // const playerID = uuidv4();
    const playerID = `player_${idx}`;
    result.push({
      id: playerID,
      token: createPlayerToken(playerID, gameScheduleID),
    });
  }
  return result;
}

const gameSchedules = new Map<string, DbGameSchedule<GameState>>();

export async function createNewDebugGame(userID: UserID): Promise<DbGameSchedule<GameState>> {
  const gameScheduleID = userID;
  let gameSchedule = debugGameSchedules.get(gameScheduleID);
  if (!gameSchedule) {
    const players = createNewPlayers(gameScheduleID, 2);
    gameSchedule = {
      id: gameScheduleID,
      players,
    };
    debugGameSchedules.set(gameScheduleID, gameSchedule);
    gameSchedules.set(gameScheduleID, gameSchedule);
  }
  const oldDebugGame = debugGames.get(userID);
  let assignments: DbPlayerAssignment[];
  if (oldDebugGame) {
    games.delete(oldDebugGame.id);
    debugGames.delete(oldDebugGame.id);
    assignments = oldDebugGame.assignments;
  } else {
    assignments = [
      { playerID: gameSchedule.players[0].id, userID, playerNumber: 0 },
      { playerID: gameSchedule.players[1].id, userID, playerNumber: 1 },
    ];
  }
  const game = createNewGame(gameScheduleID, assignments);
  debugGames.set(userID, game);

  gameSchedule.game = game;

  return Promise.resolve(gameSchedule);
}

export function getDebugGame(userID: UserID): DbGameSchedule<GameState> {
  return debugGameSchedules.get(userID);
}

export function getGameSchedule(id: string): DbGameSchedule<GameState> {
  return gameSchedules.get(id);
}

export function getGame(id: string): DbGame<GameState> {
  return games.get(id);
}
