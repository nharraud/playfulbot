import { GameState } from "playfulbot-game";
export * as errors from "./errors";

export interface GameAction {
  player: number;
  data: unknown;
}

export type GameActionHandler<GS extends GameState, GA extends GameAction> = (
  state: GS,
  actions: GA[]
) => void;

export interface BackendGameDefinition {
  name: string;
  init: () => GameState;
  actionHandler: GameActionHandler<any, any>;
}
