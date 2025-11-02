import { useMutation, useQuery } from '@apollo/client/react';
import { useAuthenticatedUser } from './authenticatedUser';
import * as gqlTypes from '../../../types/graphql';

import { graphql } from '../../../types/backend/graphql';
import { OperationVariables, TypedDocumentNode } from '@apollo/client';

const getTeamArenasQuery = graphql(`
  query GetTeamArenas($userID: ID!, $tournamentID: ID!) {
    team(userID: $userID, tournamentID: $tournamentID) {
      ... on Team {
        id
        arenas {
          id
          name
        }
      }
      ... on UserNotPartOfAnyTeam {
        message
      }
    }
  }
`)

export function useTeamArenas(tournamentID?: gqlTypes.TournamentID) {
  const { authenticatedUser } = useAuthenticatedUser();
  const skip = !authenticatedUser || !authenticatedUser.id || !tournamentID;
  const { loading, error, data, refetch } = useQuery(
    getTeamArenasQuery,
    {
      variables: {
        userID: authenticatedUser?.id as string,
        tournamentID: tournamentID as string,
      },
      skip,
    }
  );

  let userNotPartOfAnyTeam;
  let arenas: gqlTypes.Arena[] | undefined;

  if (data?.team && data?.team.__typename === 'Team') {
    arenas = data?.team?.arenas as gqlTypes.Arena[];
  } else if (data?.team && data?.team.__typename === 'UserNotPartOfAnyTeam') {
    userNotPartOfAnyTeam = true;
  }

  return { arenas, userNotPartOfAnyTeam, loading: loading || skip, error, refetch };
}
