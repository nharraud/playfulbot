import * as gameStateSchema from "./gameStateSchema.json";
import * as fillSpaceActionSchema from "./fillSpaceActionSchema.json";
import FillSpaceAction from "./FillSpaceAction";
import GameState from "./GameState";
import { ActionResult } from "~team_builder/Game"

// import typeDefs from "./graphql";

function fillSpace(player: number, currentState: GameState, newState: GameState,
                   action: FillSpaceAction): ActionResult {
    newState.grid[action.space] = newState.players[player].symbol;
    return new ActionResult();
}

const actions = {
    fillSpace: {
        schema: fillSpaceActionSchema,
        handler: fillSpace
    }
}

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
