import { TeamID, validateTeamName } from '~playfulbot/core/entities/Teams';
import { createTeam } from '~playfulbot/core/use-cases/team/createTeam';
import { AuthenticationError } from '~playfulbot/errors';
import { ApolloContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/apolloTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { toGraphQLError } from './errors';
import { updateTeam } from '~playfulbot/core/use-cases/team/updateTeam';

export const createTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['createTeam'] = async (
  parent,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new AuthenticationError('Only authenticated users are allowed to create teams.');
  }
  const teamNameError = validateTeamName(args.input.name);
  if (teamNameError) {
    return {
      __typename: 'CreateTeamFailure',
      errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [teamNameError] }) }]
    } as gqlTypes.CreateTeamFailure;
  }

  const teamOrError = await createTeam(apolloContext.ctx, {
    teamName: args.input.name,
    userId: apolloContext.userID,
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

export const updateTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['updateTeam'] = async (
  parent,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new AuthenticationError(`Only authenticated users are allowed to update teams.`);
  }

  const teamNameError = validateTeamName(args.input.name);
  if (teamNameError) {
    return {
      __typename: 'UpdateTeamFailure',
      errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [teamNameError] }) }]
    } as gqlTypes.UpdateTeamFailure;
  }

  const result = await updateTeam(apolloContext.ctx, { teamId: args.teamID, userId: apolloContext.userID, patch: args.input })
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

export const teamResolver: gqlTypes.QueryResolvers<ApolloContext>['team'] = async (
  parent,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new AuthenticationError('Only Users can ask for memberships.');
  }
  const team = await apolloContext.ctx.providers.team.getTeamByMember(apolloContext.ctx, args.userID, args.tournamentID);
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
  apolloContext: ApolloContext
): Promise<gqlTypes.User[]> {
  const result = await apolloContext.ctx.providers.user.getUsersByTeam(apolloContext.ctx, args.teamID || parent?.id);
  return result.map((user) => ({
    id: user.id,
    username: user.username,
  }));
}

export async function teamTournamentResolver(
  parent: gqlTypes.Team,
  args: {},
  apolloContext: ApolloContext
): Promise<gqlTypes.Tournament> {
  return await apolloContext.ctx.providers.tournament.getTournamentByTeam(apolloContext.ctx, parent.id);
}

// export const joinTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['joinTeam'] = async (
//   parent,
//   args,
//   ctx
// ) => {
//   if (!isUserContext(ctx)) {
//     throw new AuthenticationError(`Only authenticated users are allowed to create tournaments.`);
//   }
//   return db.default.tx(async (tx) => {
//     const newTeam = await Team.getByID(args.teamID, tx);
//     if (!newTeam) {
//       return {
//         __typename: 'JoinTeamFailure',
//         errors: [
//           { __typename: 'TeamNotFoundError', teamID: args.teamID, message: 'Team not found' },
//         ],
//       };
//     }

//     const addMemberResult = await newTeam.addMember(ctx.userID, tx);
//     // eslint-disable-next-line prefer-destructuring
//     let oldTeam: gqlTypes.TeamOrDeletedTeam = addMemberResult.oldTeam;
//     if (addMemberResult.oldTeamDeleted) {
//       oldTeam = {
//         __typename: 'DeletedTeam',
//         teamID: addMemberResult.oldTeam.id,
//         name: addMemberResult.oldTeam.name,
//       };
//     }
//     return {
//       __typename: 'JoinTeamSuccess',
//       oldTeam,
//       newTeam: await Team.getByID(args.teamID, tx),
//     };
//   });
// };
