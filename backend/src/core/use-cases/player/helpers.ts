import { ArenaID } from "~playfulbot/core/entities/base-types";
import { PlayerID } from "~playfulbot/core/entities/Players";
import { TeamID } from "~playfulbot/core/entities/Teams";
import { PlayerNotFoundError } from "~playfulbot/core/use-cases/Errors";

export enum PlayerTypes {
  ARENA = 'ARENA',
  TEAM = 'TEAM'
}

const PlayerIdPrefixes: Record<string, PlayerTypes> = {
  'A': PlayerTypes.ARENA,
  'T': PlayerTypes.TEAM,
}

export function getPlayerTypeFromPlayerId(playerId: PlayerID): null | PlayerTypes {
  if (playerId?.length <= 1) {
    return null;
  }
  const type = PlayerIdPrefixes[playerId[0]]
  return type || null;
}

export function getPlayerOwnerId(playerId: PlayerID): { teamId: TeamID } | { arenaId: ArenaID } | null {
  const type = getPlayerTypeFromPlayerId(playerId);
  if (!type) {
    return null;
  }
  const ownerId = playerId.split('_')[0].substring(1);
  if (type === PlayerTypes.ARENA) {
    return { arenaId: ownerId };
  } else if (type === PlayerTypes.TEAM) {
    return { teamId: ownerId };
  } else {
    throw new Error('Unsupported Player type');
  }
}

export function getArenaPlayerId(arenaId: ArenaID, playerNb: number) {
  return `${PlayerIdPrefixes[PlayerTypes.ARENA]}${arenaId}_${playerNb}`;
}

export function getTeamPlayerId(teamId: TeamID, playerNb: number) {
  return `${PlayerIdPrefixes[PlayerTypes.TEAM]}${teamId}_${playerNb}`;
}