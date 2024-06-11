import { GameAction, GameActionHandler, BackendGameDefinition } from 'playfulbot-game-backend';
import { GameState } from 'playfulbot-game';
import { Game } from '~game-runner/core/entities/Game';
import { PlayerID } from '~game-runner/core/entities//base-types';

export type TestGameState = GameState;

export interface TestActionData extends Record<string, unknown> {
  wins: boolean;
}

export interface TestGameAction extends GameAction {
  player: number;
  data: TestActionData;
}

function init(): GameState {
  return {
    end: false,
    players: [
      {
        playing: true,
      },
      {
        playing: true,
      },
    ],
  };
}

const actionHandler: GameActionHandler<TestGameState, TestGameAction> = (
  state: TestGameState,
  actions: TestGameAction[]
) => {
  for (const action of actions) {
    state.players[action.player].playing = false;
    if (action.data.wins) {
      state.players[action.player].winner = true;
      state.end = true;
    }
  }
  if (!state.players.some(p => p.playing)) {
    for (const player of state.players) {
      player.playing = true;
    }
  }
};

export const gameDefinition: BackendGameDefinition = {
  name: 'TestGame',
  actionHandler,
  init,
};

export function playGameSoThatGivenPlayerWins(game: Game, winnerID: PlayerID): void {
  for (const [playerNumber, assignment] of game.players.entries()) {
    if (assignment.playerID !== winnerID) {
      game.play(playerNumber, { wins: false });
    }
  }
  const winnerNumber = game.players.findIndex((assignment) => assignment.playerID === winnerID);
  game.play(winnerNumber, { wins: true });
}

export function playGameAndGetADraw(game: Game): void {
  game.play(0, { wins: false });
  game.play(1, { wins: false });
}
