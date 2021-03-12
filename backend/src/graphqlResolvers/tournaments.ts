import { ForbiddenError } from 'apollo-server-koa';
import { TournamentNotFoundError } from '~playfulbot/errors';
import { createTournament, getTournamentByID } from '~playfulbot/Model/Tournaments';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { Tournament } from '~playfulbot/types/backend';

interface createTournamentMutationArguments {
  name: string;
}

export async function createTournamentResolver(
  parent: unknown,
  args: createTournamentMutationArguments,
  context: ApolloContext
): Promise<Tournament> {
  if (!isUserContext(context)) {
    throw new ForbiddenError(`Only authenticated users are allowed to create tournaments.`);
  }
  return createTournament(args.name);
}

interface TournamentQueryArguments {
  tournamentID: string;
}

export async function tournamentResolver(
  parent: unknown,
  args: TournamentQueryArguments,
  context: ApolloContext
): Promise<Tournament> {
  const tournament = await getTournamentByID(args.tournamentID);
  if (tournament === null) {
    throw new TournamentNotFoundError();
  }
  return tournament;
}
