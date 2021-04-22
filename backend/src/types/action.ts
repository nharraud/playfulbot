import { GameState } from '~playfulbot/types/gameState';

export interface GameAction {
  player: number;
  data: Record<string, unknown>;
}

export type GameActionHandler<GS extends GameState, GA extends GameAction> = (
  state: GS,
  actions: GA[]
) => void;

export interface GameActionDefinition {
  // schema: Record<string, unknown>;
  handler: GameActionHandler<any, any>;
}
