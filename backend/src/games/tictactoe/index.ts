import * as gameStateSchema from "./gameStateSchema.json";
import * as fillSpaceActionSchema from "./fillSpaceActionSchema.json";
import FillSpaceAction from "./FillSpaceAction";
import GameState from "./GameState";
import { ActionResult, Action, ActionHandler } from "~team_builder/Game"

// import typeDefs from "./graphql";

function fillSpace(player: number, state: GameState,
                   action: FillSpaceAction): ActionResult {
    state.grid[action.space] = state.players[player].symbol;
    return new ActionResult();
}

const actions: Map<string, Action<GameState, any>> = new Map(Object.entries({
    fillSpace: {
        schema: fillSpaceActionSchema,
        handler: fillSpace
    }
}));

function init(): GameState {
    return {
        grid: [
            "x", "o", "x",
            "", "", "",
            "", "", "",
        ],
        players: [
            {
                symbol: "x"
            },
            {
                symbol: "o"
            }
        ]
    }
}

const minPlayers = 2;
const maxPlayers = 2;

export {
    minPlayers,
    maxPlayers,
    gameStateSchema,
    init,
    actions
};
