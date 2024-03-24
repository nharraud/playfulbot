function init() {
    return {
        end: false,
        players: [
            {
                playing: true,
            },
            {
                playing: true,
            },
        ],
    };
}
const actionHandler = (state, actions) => {
    for (const action of actions) {
        if (action.data.wins) {
            state.players[action.player].winner = true;
        }
    }
    state.end = true;
};
export const gameDefinition = {
    name: 'TestGame',
    actionHandler,
    init,
};
export function playGameSoThatGivenPlayerWins(game, winnerID) {
    for (const [playerNumber, assignment] of game.players.entries()) {
        if (assignment.playerID !== winnerID) {
            game.play(playerNumber, { wins: false });
        }
    }
    const winnerNumber = game.players.findIndex((assignment) => assignment.playerID === winnerID);
    game.play(winnerNumber, { wins: true });
}
export function playGameAndGetADraw(game) {
    game.play(0, { wins: false });
    game.play(1, { wins: false });
}
//# sourceMappingURL=testgame.js.map