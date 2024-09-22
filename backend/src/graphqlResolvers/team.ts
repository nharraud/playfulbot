import { AuthenticationError } from '~playfulbot/errors';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { db } from '~playfulbot/model/db';
import * as gqlTypes from '~playfulbot/types/graphql';
import { Team, TeamID } from '~playfulbot/infrastructure/TeamsPSQL';
import { User } from '~playfulbot/infrastructure/UserProviderPSQL';
import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';
import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
import { isValidationError, validationErrorsToGraphQL } from '~playfulbot/model/validate';

export const createTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['createTeam'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new AuthenticationError(`Only authenticated users are allowed to create teams.`);
  }
  if (args.join !== true) {
    return {
      __typename: 'CreateTeamFailure',
      errors: [
        {
          __typename: 'ValidationError',
          message: 'Empty teams are not yet supported. "join" must be "true"',
        },
      ],
    };
  }

  return db.default.tx(async (tx): Promise<gqlTypes.CreateTeamResult> => {
    const isInvited = await TournamentInvitation.isInvited(args.tournamentID, ctx.userID, tx);
    const hasTeam = await Team.hasTeam(ctx.userID, args.tournamentID, tx);
    const isOrganizer = await Tournament.isOrganizer(args.tournamentID, ctx.userID, tx);
    if (!isInvited && !hasTeam && !isOrganizer) {
      return {
        __typename: 'CreateTeamFailure',
        errors: [
          {
            __typename: 'ForbiddenError',
            message:
              'Only tournament invitees, team members and tournament organizers can create new teams.',
          },
        ],
      };
    }

    const teamOrError = await Team.create(args.input.name, args.tournamentID, tx);
    if (isValidationError(teamOrError)) {
      return {
        __typename: 'CreateTeamFailure',
        errors: validationErrorsToGraphQL(teamOrError),
      };
    }
    if (args.join) {
      await teamOrError.addMember(ctx.userID, tx);
    }
    return {
      __typename: 'CreateTeamSuccess',
      team: teamOrError,
    };
  });
};

export const updateTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['updateTeam'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new AuthenticationError(`Only authenticated users are allowed to update teams.`);
  }
  return db.default.tx(async (tx): Promise<gqlTypes.UpdateTeamResult> => {
    if (args.input.name === undefined) {
      return {
        __typename: 'UpdateTeamFailure',
        errors: [
          {
            __typename: 'ValidationError',
            message: 'Update should modify at least one field.',
          },
        ],
      };
    }

    const isMember = await Team.isMember(args.teamID, ctx.userID, tx);
    if (!isMember) {
      return {
        __typename: 'UpdateTeamFailure',
        errors: [
          {
            __typename: 'ForbiddenError',
            message: 'You are not a member of this team. Only team members can modify it.',
          },
        ],
      };
    }

    const teamOrError = await Team.update(args.teamID, args.input, tx);
    if (isValidationError(teamOrError)) {
      return {
        __typename: 'UpdateTeamFailure',
        errors: validationErrorsToGraphQL(teamOrError),
      };
    }

    return {
      __typename: 'UpdateTeamSuccess',
      team: teamOrError,
    };
  });
};

export const teamResolver: gqlTypes.QueryResolvers<ApolloContext>['team'] = async (
  parent,
  args,
  ctx
) => {
  // if (!isUserContext(context)) {
  //   throw new ForbiddenError('Only Users can ask for memberships.');
  // }
  const team = await Team.getByMember(args.userID, args.tournamentID, db.default);
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
  parent: Team | undefined,
  args: TeamMembersQueryArguments,
  context: ApolloContext
): Promise<gqlTypes.User[]> {
  // FIXME: this should run in the same transaction as the parent query
  const result = await User.getByTeam(args.teamID || parent?.id, db.default);
  return result.map((user) => ({
    id: user.id,
    username: user.username,
  }));
}

export async function teamTournamentResolver(
  parent: Team,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Tournament> {
  // FIXME: this should run in the same transaction as the parent query
  return Tournament.getByTeam(parent.id, db.default);
}

export const joinTeamResolver: gqlTypes.MutationResolvers<ApolloContext>['joinTeam'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new AuthenticationError(`Only authenticated users are allowed to create tournaments.`);
  }
  return db.default.tx(async (tx) => {
    const newTeam = await Team.getByID(args.teamID, tx);
    if (!newTeam) {
      return {
        __typename: 'JoinTeamFailure',
        errors: [
          { __typename: 'TeamNotFoundError', teamID: args.teamID, message: 'Team not found' },
        ],
      };
    }

    const addMemberResult = await newTeam.addMember(ctx.userID, tx);
    // eslint-disable-next-line prefer-destructuring
    let oldTeam: gqlTypes.TeamOrDeletedTeam = addMemberResult.oldTeam;
    if (addMemberResult.oldTeamDeleted) {
      oldTeam = {
        __typename: 'DeletedTeam',
        teamID: addMemberResult.oldTeam.id,
        name: addMemberResult.oldTeam.name,
      };
    }
    return {
      __typename: 'JoinTeamSuccess',
      oldTeam,
      newTeam: await Team.getByID(args.teamID, tx),
    };
  });
};
