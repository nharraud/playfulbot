import { Tournament } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { TournamentRole } from "~playfulbot/core/entities/TournamentRole";

export async function createTournament(
  ctx: Context<any>, params: {
    tournamentName: string, startDate: string, endDate: string,
  }
): Promise<Tournament> {
  const gameDefinitions = await ctx.providers.gameDefinitions.getGameDefinitions();
  const gameDefinition = gameDefinitions.keys().next();

  const tournament = await ctx.providers.tournament.createTournament(ctx, {
      name: params.tournamentName,
      startDate: params.startDate,
      endDate: params.endDate,
      gameDefinitionId: gameDefinition.value
    }
  );

  await ctx.providers.tournament.changeTournamentRole(ctx, {
    tournamentId: tournament.id, userId: ctx.requestingUserId, role: TournamentRole.Organizer
  });

  return tournament;
}