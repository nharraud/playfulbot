import { createPlayerToken } from "playfulbot-backend-commons/lib/graphqlResolvers/authentication";
import { Arena } from "~playfulbot/core/entities/Arena";
import { getArenaPlayerId } from "../player/helpers";

export function getArenaPlayers(arena: Arena) {
  return Array.from(
    {length: arena.nbPlayers},
    (_val, idx) => {
      const playerId = getArenaPlayerId(arena.id, idx);
      return {
        id: playerId,
        token: createPlayerToken(playerId),
      }
    }
  );
}