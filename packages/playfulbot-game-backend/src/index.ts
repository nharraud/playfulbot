import { GameState } from "playfulbot-game";

export interface GameAction {
  player: number;
  data: Record<string, unknown>;
}

export type GameActionHandler<GS extends GameState, GA extends GameAction> = (
  state: GS,
  actions: GA[]
) => void;

export interface GameActionDefinition {
  handler: GameActionHandler<any, any>;
}

export interface BackendGameDefinition {
  name: string;
  init: () => GameState;
  actions: GameActionDefinition;
}
