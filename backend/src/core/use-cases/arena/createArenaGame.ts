import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ArenaNotFoundError, ForbiddenError } from "../Errors";
import { ArenaID } from "~playfulbot/core/entities/base-types";
import { GameRef } from "~playfulbot/core/entities/GameRef";
import { PlayerAssignment } from "~playfulbot/core/entities/PlayerAssignment";

function generatePlayerID(arenaId: ArenaID, playerNumber: number): string {
  return `${arenaId}_player${playerNumber}`;
}

export async function createArenaGame(
  ctx: Context<any>, { userId, arenaId }: { userId: UserID, arenaId: ArenaID }
): Promise<GameRef | ForbiddenError | ArenaNotFoundError> {

  const arena = await ctx.providers.arena.getArena(ctx, arenaId);
  if (!arena) {
    return new ArenaNotFoundError(arenaId);
  }

  const isMember = await ctx.providers.team.isTeamMember(ctx, arena.teamId, userId);

  if (!isMember) {
    return new ForbiddenError('You are not member of this team');
  }

  const game = await ctx.providers.gameRepository.getArenaLatestGame(arenaId);
  let players: PlayerAssignment[];
  if (game) {
    const fullGame = await ctx.providers.gameRepository.getFullGame(game.gameId);
    await ctx.providers.gameRepository.cancelGame(game.gameId);
    players = fullGame.players;
  } else {
    players = Array.from(
      {length: 2},
      (_, idx) => ({ playerID: generatePlayerID(arena.id, idx) })
    )
  }

  const tournament = await ctx.providers.tournament.getTournamentByTeam(ctx, arena.teamId);

  return ctx.providers.gameRepository.addGame({
    gameDefId: tournament.gameDefinitionId,
    players,
    arenaId: arena.id,
    waitUntilStarted: false
  });
}