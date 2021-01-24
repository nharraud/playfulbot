import { GameState } from '~playfulbot/types/gameState';

export type ActionData = Record<string, unknown>;

export type ActionHandler<GS, AD extends ActionData | null> = (
  player: number,
  state: GS,
  actionData: AD
) => void;

export type Action<GS extends GameState, AD extends ActionData | null> = {
  schema: Record<string, unknown>;
  handler: ActionHandler<GS, AD>;
};
