import { useCallback } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { useAuthenticatedUser } from './authenticatedUser';
import { Tournament } from '../types/graphql-generated';
import { client as apolloClient } from '../apolloConfig';

import * as gqlTypes from '../types/graphql';
import { useFragment } from './useFragment';

import { useRestartingSubscription } from './useRestartingSubscription';

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

function fullGameID(gameID) {
  return `Game:${gameID}`;
}

function fullPlayerID(playerID) {
  return `Player:${playerID}`;
}

function useGameSubscription(gameID: string) {
    const {data, loading, error } = useRestartingSubscription<gqlTypes.GameSubscription>(gqlTypes.GameDocument, {
    variables: { gameID: gameID },
    skip: !gameID,
    shouldResubscribe: true,
  });

  if (data) {
    if (data.game.__typename === 'GameCanceled') {
      apolloClient.writeFragment({
        id: fullGameID(data.game.gameID),
        fragment: gqlTypes.GameCancelFragmentDoc,
        data: {
          canceled: true,
          version: data.game.version
        },
      });
    } else if (data.game.__typename === 'GamePatch') {
      const version = data.game.version;
      const modifiedGameID = fullGameID(data.game.gameID);
      const game = apolloClient.readFragment<gqlTypes.GameFragment>({
        id: modifiedGameID,
        fragment: gqlTypes.GameFragmentDoc
      });

      if (version !== game.version) {
        if (version !== game.version + 1) {
          throw new Error('Missing game version');
        }

        apolloClient.writeFragment({
          id: modifiedGameID,
          fragment: gqlTypes.GamePatchFragmentDoc,
          data: {
            patches: game.patches.concat([data.game.patch]),
            version: version,
            winners: data.game.winners
          },
        });
      }
    } else if (data.game.__typename === 'PlayerConnection') {
      apolloClient.writeFragment<gqlTypes.PlayerFragment>({
        id: fullPlayerID(data.game.playerID),
        fragment: gqlTypes.PlayerFragmentDoc,
        data: {
          connected: data.game.connected
        },
      });
    }
  }

  const result = useFragment<gqlTypes.GameFragment>({
    id: fullGameID(gameID),
    fragment: gqlTypes.GameFragmentDoc,
  });

  return { game: result || undefined }
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