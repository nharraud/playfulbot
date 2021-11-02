import { useCallback } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { useAuthenticatedUser } from './authenticatedUser';
import { Tournament } from '../types/graphql-generated';
import { client as apolloClient } from '../apolloConfig';

import * as gqlTypes from '../types/graphql';
import { useFragment } from './useFragment';

import { useRestartingSubscription } from './useRestartingSubscription';
import { GameID } from '../../../packages/playfulbot-game/lib';
import { Maybe } from 'graphql/jsutils/Maybe';

export default function useDebugGame(tournament?: Tournament) {
  const { authenticatedUser } = useAuthenticatedUser();

  const debugArena = useDebugArenaSubscription(authenticatedUser?.id, tournament?.id);
  const {game} = useGameSubscription(debugArena?.arena?.game);
  const createDebugGame = useCreateDebugGame(authenticatedUser?.id, tournament?.id);
  return {game, createDebugGame};
}


function useDebugArenaSubscription(userID?: string, tournamentID?: string) {
  const {data, loading, error} = useSubscription<gqlTypes.DebugArenaSubscription>(gqlTypes.DebugArenaDocument, {
    variables: { userID, tournamentID },
    skip: !userID || !tournamentID,
    shouldResubscribe: true,
  });
  return { arena: data?.debugArena };
}

function fullGameID(gameID?: Maybe<GameID>) {
  return gameID ? `Game:${gameID}` : undefined;
}

function fullPlayerID(playerID?: Maybe<gqlTypes.PlayerID>) {
  return playerID ? `Player:${playerID}` : undefined;
}

function useGameSubscription(gameID?: Maybe<string>) {
    const {data, loading, error } = useRestartingSubscription<gqlTypes.GameSubscription>(gqlTypes.GameDocument, {
    variables: { gameID: gameID },
    skip: !gameID,
    shouldResubscribe: true,
  });

  if (data) {
    if (data.game?.__typename === 'GameCanceled') {
      apolloClient.writeFragment({
        id: fullGameID(data.game.gameID),
        fragment: gqlTypes.GameCancelFragmentDoc,
        data: {
          canceled: true,
          version: data.game.version
        },
      });
    } else if (data.game?.__typename === 'GamePatch') {
      const version = data.game.version;
      const modifiedGameID = fullGameID(data.game.gameID);
      const game = apolloClient.readFragment<gqlTypes.GameFragment>({
        id: modifiedGameID,
        fragment: gqlTypes.GameFragmentDoc
      });

      if (version !== game?.version) {
        if (version !== (game?.version || 0) + 1) {
          throw new Error('Missing game version');
        }

        apolloClient.writeFragment({
          id: modifiedGameID,
          fragment: gqlTypes.GamePatchFragmentDoc,
          data: {
            patches: game?.patches.concat([data.game.patch]),
            version: version,
            winners: data.game.winners
          },
        });
      }
    } else if (data.game?.__typename === 'PlayerConnection') {
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

function useCreateDebugGame(userID?: Maybe<string>, tournamentID?: Maybe<string>) {
  const [createNewDebugGameMutation] = useMutation<
      gqlTypes.CreateNewDebugGameMutation, gqlTypes.CreateNewDebugGameMutationVariables
    >(gqlTypes.CreateNewDebugGameDocument);

  const createDebugGame = useCallback(
    () =>  {
      if (!userID || !tournamentID) {
        throw new Error('userID or tournamentID are missing');
      }
      createNewDebugGameMutation({variables:{userID, tournamentID}});
    }
  , [createNewDebugGameMutation, userID, tournamentID]);

  return createDebugGame;
}