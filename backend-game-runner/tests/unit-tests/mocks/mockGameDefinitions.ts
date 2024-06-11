import { GameState } from "playfulbot-game";
import { GameAction, GameActionHandler } from "playfulbot-game-backend";

interface TestGameState extends GameState {
};

interface TestActionData extends Record<string, unknown> {
  wins?: boolean;
}

interface TestGameAction extends GameAction {
  player: number;
  data: TestActionData;
}

function basicInit(): TestGameState {
  return {
    end: false,
    players: [{ playing: true }]
  };
}

const noopHandler: GameActionHandler<TestGameState, TestGameAction> = (
  state: TestGameState,
  actions: TestGameAction[]
) => { };

export const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: basicInit };
