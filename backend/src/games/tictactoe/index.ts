import * as gameStateSchema from "./gameStateSchema.json";
import * as fillSpaceActionSchema from "./fillSpaceActionSchema.json";
import FillSpaceAction from "./FillSpaceAction";
import GameState from "./GameState";
import { /*ActionResult,*/ Action, ActionHandler } from "~playfulbot/Game"
import { IllegalPlayAction } from "~playfulbot/Errors";

// import typeDefs from "./graphql";

function findWinner(grid: string[]): string {
    for (const idx of [0, 1, 2]) {
        if (grid[3 * idx] === grid[3 * idx + 1]  && grid[3 * idx] === grid[3 * idx + 2]) {
            return grid[3 * idx];
        }
        if (grid[idx] === grid[idx + 3]  && grid[idx] === grid[idx + 6]) {
            return grid[idx];
        }
    }
    if (grid[0] === grid[4]  && grid[0] === grid[8]) {
        return grid[0];
    }
    if (grid[2] === grid[4]  && grid[2] === grid[6]) {
        return grid[2];
    } 
    return null;
}

function fillSpace(player: number, state: GameState,
                   action: FillSpaceAction)/*: ActionResult*/ {
    if (state.grid[action.space]) {
        throw new IllegalPlayAction("Space already filled."); 
    }
    const playing = state.players.findIndex((player) => player.playing);
    state.grid[action.space] = state.players[player].symbol;
    state.players[player].playing = false

    const winner = findWinner(state.grid)
    if (winner) {
        state.end = true;
        state.players[player].points = 1;
        return;
    }

    // If all the squares have been filled
    if (state.grid.findIndex((space) => space === "") === -1) {
        state.end = true;
        return;
    }

    state.players[(player + 1) % 2].playing = true
    // return new ActionResult();
}

const actions: Map<string, Action<GameState, any>> = new Map(Object.entries({
    fillSpace: {
        schema: fillSpaceActionSchema,
        handler: fillSpace
    }
}));

function init(): GameState {
    return {
        end: false,
        grid: [
            "x", "o", "",
            "", "", "",
            "", "", "",
        ],
        players: [
            {
                symbol: "x",
                playing: true,
                points: 0
            },
            {
                symbol: "o",
                playing: false,
                points: 0
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
