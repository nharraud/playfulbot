import { GameState } from '~playfulbot/types/gameState';

export interface Action {
  player: number;
  name: string;
  data: Record<string, unknown> | null;
}

export type ActionHandler<GS extends GameState, Act extends Action> = (
  state: GS,
  actions: Act[]
) => void;

export interface Actions<GS extends GameState, Act extends Action> {
  schemas: Map<string, Record<string, unknown>>;
  handler: ActionHandler<GS, Act>;
}
