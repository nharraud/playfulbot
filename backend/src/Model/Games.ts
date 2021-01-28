// import { newDebugGameResolver } from "~playfulbot/graphqlResolvers/game";
import { v4 as uuidv4 } from 'uuid';
import { GameSchedule, Game, User } from '~playfulbot/types/graphql';

import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication';
import { init } from '~playfulbot/games/tictactoe';
import GameState from '~playfulbot/games/tictactoe/GameState';

const user: User = {
  id: '1',
  username: 'test',
};

function newGame(): Game<GameState> {
  const id = uuidv4();
  const token = createPlayerToken('1', 0, id);
  return {
    id,
    version: 0,
    players: [
      { playerNumber: 0, user, token },
      { playerNumber: 1, user, token },
    ],
    gameState: init(),
  };
}

const games = new Map<string, Game<GameState>>();
class PlayerState {
  debugGame: GameSchedule<GameState>;
}
const mainPlayerState = new PlayerState();

const gameSchedules = new Map<string, GameSchedule<GameState>>();

export async function createNewDebugGame(): Promise<GameSchedule<GameState>> {
  const game = newGame();
  if (mainPlayerState.debugGame) {
    games.delete(mainPlayerState.debugGame.id);
    mainPlayerState.debugGame = null;
  }
  mainPlayerState.debugGame = {
    id: '21',
    game,
  };
  gameSchedules.set(mainPlayerState.debugGame.id, mainPlayerState.debugGame);
  games.set(game.id, game);
  return Promise.resolve(mainPlayerState.debugGame);
}

export function getDebugGame(): GameSchedule<GameState> {
  return mainPlayerState.debugGame;
}

export function getGameSchedule(id: string): GameSchedule<GameState> {
  return gameSchedules.get(id);
}

export function getGame(id: string): Game<GameState> {
  return games.get(id);
}
