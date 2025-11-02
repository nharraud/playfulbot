import { TeamID, validateTeamName } from '~playfulbot/core/entities/Teams';
import { createTeam } from '~playfulbot/core/use-cases/team/createTeam';
import { AuthenticationError } from '~playfulbot/errors';
import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { toGraphQLError } from './errors';
import { updateTeam } from '~playfulbot/core/use-cases/team/updateTeam';
import { addTeamMember } from '~playfulbot/core/use-cases/team/addTeamMember';
import { ForbiddenError, NotFoundError, TeamNotFoundError, UserNotFoundError } from '~playfulbot/core/use-cases/Errors';
import { getTeamArenas } from '~playfulbot/core/use-cases/arena/getTeamArenas';

export const createTeamResolver: gqlTypes.MutationResolvers<GraphqlContext>['createTeam'] = async (
  parent,
  args,
  graphqlContext
) => {
  if (!isUserContext(graphqlContext)) {
    throw new AuthenticationError('Only authenticated users are allowed to create teams.');
  }
  const teamNameError = validateTeamName(args.input.name);
  if (teamNameError) {
    return {
      __typename: 'CreateTeamFailure',
      errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [teamNameError] }) }]
    } as gqlTypes.CreateTeamFailure;
  }

  const teamOrError = await createTeam(graphqlContext.ctx, {
    teamName: args.input.name,
    userId: graphqlContext.userID,
    tournamentId: args.tournamentID,
    join: args.join
  });

  if (teamOrError instanceof Error) {
    return {
      __typename: 'CreateTeamFailure',
      errors: [
        toGraphQLError(teamOrError),
      ],
    } as gqlTypes.CreateTeamFailure;
  }

  return {
    __typename: 'CreateTeamSuccess',
    team: teamOrError,
  };
};

export const updateTeamResolver: gqlTypes.MutationResolvers<GraphqlContext>['updateTeam'] = async (
  parent,
  args,
  graphqlContext
) => {
  if (!isUserContext(graphqlContext)) {
    throw new AuthenticationError(`Only authenticated users are allowed to update teams.`);
  }

  const teamNameError = validateTeamName(args.input.name);
  if (teamNameError) {
    return {
      __typename: 'UpdateTeamFailure',
      errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [teamNameError] }) }]
    } as gqlTypes.UpdateTeamFailure;
  }

  const result = await updateTeam(graphqlContext.ctx, { teamId: args.teamID, userId: graphqlContext.userID, patch: args.input })
  if (result instanceof Error) {
    return {
      __typename: 'UpdateTeamFailure',
      errors: [ toGraphQLError(result) ],
    } as gqlTypes.UpdateTeamFailure;
  }

  return {
    __typename: 'UpdateTeamSuccess',
    team: result,
  } as gqlTypes.UpdateTeamSuccess;
};

export const teamResolver: gqlTypes.QueryResolvers<GraphqlContext>['team'] = async (
  parent,
  args,
  graphqlContext
) => {
  if (!isUserContext(graphqlContext)) {
    throw new AuthenticationError('Only Users can ask for memberships.');
  }
  const team = await graphqlContext.ctx.providers.team.getTeamByMember(graphqlContext.ctx, args.userID, args.tournamentID);
  if (team === null) {
    return {
      __typename: 'UserNotPartOfAnyTeam',
      message: 'User is not part of any team in this tournament',
    };
  }
  return {
    __typename: 'Team',
    ...team,
  };
};

interface TeamMembersQueryArguments {
  teamID?: TeamID;
}

export async function teamMembersResolver(
  parent: gqlTypes.Team,
  args: TeamMembersQueryArguments,
  graphqlContext: GraphqlContext
): Promise<gqlTypes.User[]> {
  const result = await graphqlContext.ctx.providers.user.getUsersByTeam(graphqlContext.ctx, args.teamID || parent?.id);
  return result.map((user) => ({
    id: user.id,
    username: user.username,
  }));
}


interface TeamArenasQueryArguments {
  teamID?: TeamID;
}

export async function teamArenasResolver(
  parent: gqlTypes.Team,
  args: TeamArenasQueryArguments,
  graphqlContext: GraphqlContext
): Promise<gqlTypes.Arena[]> {
  const result = await getTeamArenas(graphqlContext.ctx, args.teamID || parent?.id);
  if (result instanceof Error) {
    return null;
  }
  return result.map((arena) => ({
    id: arena.id,
    name: arena.name,
  }));
}


export async function teamTournamentResolver(
  parent: gqlTypes.Team,
  args: {},
  graphqlContext: GraphqlContext
): Promise<gqlTypes.Tournament> {
  return await graphqlContext.ctx.providers.tournament.getTournamentByTeam(graphqlContext.ctx, parent.id);
}

export const joinTeamResolver: gqlTypes.MutationResolvers<GraphqlContext>['joinTeam'] = async (
  parent,
  args,
  graphqlContext
) => {
  if (!isUserContext(graphqlContext)) {
    throw new AuthenticationError(`Only authenticated users are allowed to create tournaments.`);
  }
  const result = await addTeamMember(graphqlContext.ctx, { teamId: args.teamID, userId: graphqlContext.userID, checkPermission: true });

  if (result instanceof UserNotFoundError) {
    throw new AuthenticationError(`User has been deleted.`);
  }

  if (result instanceof TeamNotFoundError) {
    return {
      __typename: 'JoinTeamFailure',
      errors: [
        { __typename: 'TeamNotFoundError', teamID: args.teamID, message: 'Team not found' },
      ],
    };
  }

  if (result instanceof ForbiddenError) {
    return {
      __typename: 'JoinTeamFailure',
      errors: [toGraphQLError(result)],
    };
  }

  let oldTeam: gqlTypes.TeamOrDeletedTeam;
  if (result.oldTeam) {
    oldTeam = {
      __typename: result.oldTeamDeleted ? 'DeletedTeam' : 'Team',
      id: result.oldTeam.id,
      name: result.oldTeam.name,
    }
  }

  return {
    __typename: 'JoinTeamSuccess',
    oldTeam,
    newTeam: await graphqlContext.ctx.providers.team.getTeamByID(graphqlContext.ctx, args.teamID),
  };
};
