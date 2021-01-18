export type ActionHandler<GS, AD> = (player: number, state: GS, actionData: AD) => void;

export interface Action<GS, AD> {
  schema: object;
  handler: ActionHandler<GS, AD>;
}
