export function isUserContext(context) {
    return context.userID !== undefined;
}
export function isBotContext(context) {
    return context.playerID !== undefined;
}
export function isUnauthenticatedContext(context) {
    return (context.userID === undefined &&
        context.playerID === undefined);
}
export function isUserWSContext(context) {
    return context.userID !== undefined;
}
export function isBotWSContext(context) {
    return context.playerID !== undefined;
}
//# sourceMappingURL=apolloTypes.js.map