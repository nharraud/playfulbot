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
  let teamId: string | undefined;

  if (data?.team && data?.team.__typename === 'Team') {
    teamId = data?.team?.id;
    arenas = data?.team?.arenas as gqlTypes.Arena[];
  } else if (data?.team && data?.team.__typename === 'UserNotPartOfAnyTeam') {
    userNotPartOfAnyTeam = true;
  }

  return { arenas, teamId, userNotPartOfAnyTeam, loading: loading || skip, error, refetch };
}


const createArenaMutation = graphql(`
  mutation createArena($teamID: ID!, $name: String!) {
    createArena(teamID: $teamID, name: $name) {
      ... on CreateArenaSuccess {
        arena {
          id
          name
        }
      }
      ... on CreateArenaFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`);

export function useCreateArena() {
  const [createArena] = useMutation(
    createArenaMutation
  );

  return ({teamID, name}: {teamID: gqlTypes.TeamID, name: string}) => new Promise<gqlTypes.CreateArenaMutation['createArena']>(
    (resolve) => createArena({ variables: { teamID, name }, onCompleted: data => resolve(data.createArena)})
  );
}


const deleteArenaMutation = graphql(`
  mutation deleteArena($arenaID: ID!) {
    deleteArena(arenaID: $arenaID) {
      ... on DeleteArenaSuccess {
        arenaID
      }
      ... on DeleteArenaFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`);

export function useDeleteArena() {
  const [deleteArena] = useMutation(deleteArenaMutation);

  return (arenaID: gqlTypes.ArenaID) => new Promise<gqlTypes.DeleteArenaMutation['deleteArena']>(
    (resolve) => deleteArena({ variables: { arenaID }, onCompleted: data => resolve(data.deleteArena) })
  );
}
