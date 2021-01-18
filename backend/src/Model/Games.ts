// import { newDebugGameResolver } from "~playfulbot/graphqlResolvers/game";
import { v4 as uuidv4 } from 'uuid';
import { DebugGame, Game, User } from '~playfulbot/types/graphql';

import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication';
import { init } from '~playfulbot/games/tictactoe';
import GameState from '~playfulbot/games/tictactoe/GameState';

const user: User = {
  id: '1',
  username: 'test',
};

const games = new Map<string, Game<GameState>>();
class PlayerState {
  debugGame: DebugGame;
}
const mainPlayerState = new PlayerState();

export async function createNewDebugGame(): Promise<DebugGame> {
  const game = await newGame();
  if (mainPlayerState.debugGame) {
    games.delete(mainPlayerState.debugGame.id);
    mainPlayerState.debugGame = null;
  }
  mainPlayerState.debugGame = {
    id: '21',
    game,
  };
  games.set(game.id, game);
  return mainPlayerState.debugGame;
}

export function getDebugGame() {
  return mainPlayerState.debugGame;
}

export function getGame(id: string) {
  return games.get(id);
}

async function newGame(): Promise<Game<GameState>> {
  const id = uuidv4();
  const token = await createPlayerToken('1', 0, id);
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
