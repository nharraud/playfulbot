import { useCallback, useContext } from 'react';
import { useMutation, useSubscription } from '@apollo/client/react';
import { Maybe } from 'graphql/jsutils/Maybe';
import { BackendClientContext } from 'src/infrastructure/graphql/GraphqlClientContexts'
import { graphql } from '../../../types/backend/graphql';

// export default function useArenaGame(tournament?: Tournament) {
//   const { authenticatedUser } = useAuthenticatedUser();

//   const arenaArena = useArenaArenaSubscription(authenticatedUser?.id, tournament?.id);
//   const { game } = useGameSubscription(arenaArena?.arena?.game);
//   const createArenaGame = useCreateArenaGame(authenticatedUser?.id, tournament?.id);
//   return { game, createArenaGame };
// }

const arenaGamesSubscription = graphql(`
  subscription arenaGames($arenaID: ID!) {
    arenaGames(arenaID: $arenaID) {
      ... on GameRef {
        gameID,
        graphqlUrl,
      }
      ... on ArenaGamesFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`)

export function useArenaArenaSubscription(arenaID?: string) {
  const client = useContext(BackendClientContext);
  const { data, loading, error } = useSubscription(
    arenaGamesSubscription,
    {
      variables: { arenaID: arenaID as string },
      skip: !arenaID,
      shouldResubscribe: true,
      client
    }
  );
  let gameRef;
  if (data?.arenaGames?.__typename === 'GameRef') {
    gameRef = data?.arenaGames;
  }
  return { gameRef };
}

const createArenaGameMutation = graphql(`
  mutation createArenaGame($arenaID: ID!) {
    createArenaGame(arenaID: $arenaID) {
      ... on CreateArenaGameSuccess {
        gameID
      }
      ... on CreateArenaGameFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`)

export function useCreateArenaGame(arenaID?: Maybe<string>) {
  const client = useContext(BackendClientContext);
  const [createNewArenaGameMutation] = useMutation(createArenaGameMutation, { client });

  const createArenaGame = useCallback(() => {
    if (!arenaID) {
      throw new Error('arenaID is missing');
    }
    createNewArenaGameMutation({ variables: { arenaID } });
  }, [createNewArenaGameMutation, arenaID]);

  return createArenaGame;
}
