import { useMutation, useQuery } from '@apollo/client/react';
import { useAuthenticatedUser } from './authenticatedUser';
import * as gqlTypes from '../../../types/graphql';

import { graphql } from '../../../types/backend/graphql';
import { OperationVariables, TypedDocumentNode } from '@apollo/client';

const getTeamQuery = graphql(`
  query GetTeam($userID: ID!, $tournamentID: ID!) {
    team(userID: $userID, tournamentID: $tournamentID) {
      ... on Team {
        id
        name
        members {
          id
          username
        }
      }
      ... on UserNotPartOfAnyTeam {
        message
      }
    }
  }
`)

export function useTeam(tournamentID?: gqlTypes.TournamentID) {
  const { authenticatedUser } = useAuthenticatedUser();
  const skip = !authenticatedUser || !authenticatedUser.id || !tournamentID;
  const { loading, error, data, refetch } = useQuery(
    getTeamQuery,
    {
      variables: {
        userID: authenticatedUser?.id as string,
        tournamentID: tournamentID as string,
      },
      skip,
    }
  );

  let userNotPartOfAnyTeam;
  let team: gqlTypes.Team | undefined;

  if (data?.team && data?.team.__typename === 'Team') {
    team = data?.team as gqlTypes.Team;
  } else if (data?.team && data?.team.__typename === 'UserNotPartOfAnyTeam') {
    userNotPartOfAnyTeam = true;
  }

  return { team, userNotPartOfAnyTeam, loading: loading || skip, error, refetch };
}


const createTeamMutation = graphql(`
  mutation createTeam($tournamentID: ID!, $input: TeamInput!) {
    createTeam(tournamentID: $tournamentID, input: $input) {
      ... on CreateTeamSuccess {
        team {
          id
          name
        }
      }
      ... on CreateTeamFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`);

export function useCreateTeam() {
  const [createTeam] = useMutation(
    createTeamMutation
  );

  return ({tournamentID, input}: {tournamentID: gqlTypes.TournamentID, input: gqlTypes.TeamInput}) => new Promise<gqlTypes.CreateTeamMutation['createTeam']>(
    (resolve) => createTeam({ variables: { tournamentID, input }, onCompleted: data => resolve(data.createTeam)})
  );
}



const updateTeamMutation = graphql(`
  mutation updateTeam($teamID: ID!, $input: TeamInput!) {
    updateTeam(teamID: $teamID, input: $input) {
      ... on UpdateTeamSuccess {
        team {
          id
          name
        }
      }
      ... on UpdateTeamFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`)

export function useUpdateTeam() {
  const [updateTeam] = useMutation(
    updateTeamMutation
  );

  return ({teamID, input}: {teamID: gqlTypes.TeamID, input: gqlTypes.TeamInput}) => new Promise<gqlTypes.UpdateTeamMutation['updateTeam']>(
    (resolve) => updateTeam({ variables: { teamID, input }, onCompleted: data => resolve(data.updateTeam)})
  );
}

export const joinTeamMutation = graphql(`
  mutation joinTeam($teamID: ID!) {
      joinTeam(teamID: $teamID) {
          ... on JoinTeamSuccess {
            newTeam {
              id
            }
          }
          ... on JoinTeamFailure {
            errors {
              ... on TeamNotFoundError {
                teamID
                message
              }
              ... on Error {
                message
              }
            }
          }
      }
  }
`);

export const tournamentTeamsQuery = graphql(`
  query tournamentTeams($tournamentID: ID!) {
    tournament(tournamentID: $tournamentID) {
      id
      teams {
        id
        name
        members {
          id
          username
        }
      }
    }
  }
`);