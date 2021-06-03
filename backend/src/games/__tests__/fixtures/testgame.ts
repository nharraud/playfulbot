import { GameDefinition, gameDefinitions } from '~playfulbot/model/GameDefinition';
import { GameState } from '~playfulbot/types/gameState';
import { GameAction, GameActionHandler } from '~playfulbot/types/action';
import { IllegalPlayAction } from '~playfulbot/errors';
import { Game } from '~playfulbot/model/Game';
import { PlayerID } from '~playfulbot/model/Player';

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
    if (action.data.wins) {
      state.players[action.player].winner = true;
    }
  }
  state.end = true;
};

export const gameDefinition: GameDefinition = {
  name: 'Test game',
  actions: { handler: actionHandler },
  init,
};

export function registerTestGame(): void {
  gameDefinitions.set(gameDefinition.name, gameDefinition);
}

export function playGameSoThatGivenPlayerWins(game: Game, winnerID: PlayerID): void {
  for (const [playerNumber, assignment] of game.players.entries()) {
    if (assignment.playerID !== winnerID) {
      game.play(playerNumber, 'whatever', { wins: false } as TestActionData);
    }
  }
  const winnerNumber = game.players.findIndex((assignment) => assignment.playerID === winnerID);
  game.play(winnerNumber, 'whatever', { wins: true } as TestActionData);
}

export function playGameAndGetADraw(game: Game): void {
  game.play(0, 'whatever', { wins: false } as TestActionData);
  game.play(1, 'whatever', { wins: false } as TestActionData);
}
