
export class ActionResult {
    winner?: number;

    constructor(winner?: number) {
        this.winner = winner;
    }
}

export type ActionHandler<GS, AD> = (player: number, state: GS, actionData: AD) => ActionResult

export interface Action<GS, AD> {
    schema: object,
    handler: ActionHandler<GS, AD>
}
