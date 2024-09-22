;
function basicInit() {
    return {
        end: false,
        players: [{ playing: true }]
    };
}
const noopHandler = (state, actions) => { };
export const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: basicInit };
//# sourceMappingURL=mockGameDefinitions.js.map