
/**
 * Error thrown by a game handler.
 */
export class PlayfulbotGameError extends Error {}

/**
 * Play action data is valid but not authorized for the current Game State.
 */
export class IllegalPlayAction extends PlayfulbotGameError {}

/**
 * Invalid Play action data.
 */
export class InvalidPlayActionData extends PlayfulbotGameError {}