import { useCallback } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useMutation, useSubscription } from '@apollo/client';
import { useAuthenticatedUser } from './authenticatedUser';
import { Tournament } from '../types/graphql-generated';
import { client as apolloClient } from '../apolloConfig';

import * as gqlTypes from '../types/graphql';

export default function useDebugGame(tournament: Tournament) {
  const { authenticatedUser } = useAuthenticatedUser();

  const debugArena = useDebugArenaSubscription(authenticatedUser?.id, tournament?.id);
  const {game} = useGameSubscription(debugArena?.arena?.game);
  const createDebugGame = useCreateDebugGame(authenticatedUser?.id, tournament?.id);
  return {game, createDebugGame};
}


function useDebugArenaSubscription(userID: string, tournamentID: string) {
  const {data, loading, error} = useSubscription<gqlTypes.DebugArenaSubscription>(gqlTypes.DebugArenaDocument, {
    variables: { userID, tournamentID },
    skip: !userID || !tournamentID,
    shouldResubscribe: true,
  });
  return { arena: data?.debugArena };
}


function useGameSubscription(gameID: string) {
  const fullGameID = `Game:${gameID}`;

  const {data, loading, error} = useSubscription<gqlTypes.GameSubscription>(gqlTypes.GameDocument, {
    variables: { gameID: gameID },
    skip: !gameID,
    shouldResubscribe: true,
  });

  let game: gqlTypes.GameFragment = undefined;

  if (!data) {
    game = undefined;
  } else if (data.game.__typename === 'Game') {
    game = data.game;
  } else if (data.game.__typename === 'GameCanceled') {
    apolloClient.writeFragment({
      id: fullGameID,
      fragment: gqlTypes.GameCancelFragmentDoc,
      data: {
        canceled: true,
        version: data.game.version
      },
    });
    game = apolloClient.readFragment<gqlTypes.GameFragment>({
      id: fullGameID,
      fragment: gqlTypes.GameFragmentDoc
    });
  } else if (data.game.__typename === 'GamePatch') {
    const version = data.game.version;
    const patch = data.game.patch;
    game = apolloClient.readFragment<gqlTypes.GameFragment>({
      id: fullGameID,
      fragment: gqlTypes.GameFragmentDoc
    });

    if (version !== game.version) {
      if (version !== game.version + 1) {
        throw new Error('Missing game version');
      }

      const newGameState = applyPatch(game.gameState, patch, false, false).newDocument;

      apolloClient.writeFragment({
        id: fullGameID,
        fragment: gqlTypes.GamePatchFragmentDoc,
        data: {
          gameState: newGameState,
          version: version
        },
      });
      game = apolloClient.readFragment<gqlTypes.GameFragment>({
        id: fullGameID,
        fragment: gqlTypes.GameFragmentDoc
      });
    }
  }
  return { game }
}

function useCreateDebugGame(userID: string, tournamentID: string) {
  const [createNewDebugGameMutation] = useMutation<
      gqlTypes.CreateNewDebugGameMutation, gqlTypes.CreateNewDebugGameMutationVariables
    >(gqlTypes.CreateNewDebugGameDocument);

  const createDebugGame = useCallback(
    () =>  {
      createNewDebugGameMutation({variables:{userID, tournamentID}});
    }
  , [createNewDebugGameMutation, userID, tournamentID]);

  return createDebugGame;
}