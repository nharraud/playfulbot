import { useCallback, useContext } from 'react';
import { useMutation, useSubscription } from '@apollo/client/react';
import { Maybe } from 'graphql/jsutils/Maybe';
import { GameID } from 'playfulbot-game';
import { useAuthenticatedUser } from '../../backend/graphql/authenticatedUser';
import { Tournament } from '../../../types/graphql';
import { RunnerClientContext } from 'src/infrastructure/graphql/GraphqlClientContexts'
import { graphql } from '../../../types/game-runner/graphql';

import * as gqlTypes from '../../../types/graphql';
import { useFragment } from '../../useFragment';

// import { useRestartingSubscription } from '../../useRestartingSubscription';



const GameSubscription = graphql(`
  subscription game($gameID: ID!) {
    game(gameID: $gameID) {

      ... on GamePatch {
        gameID, version, patch, winners
      }
      ... on Game {
        id
        canceled
        version
        players {
          id, token, connected
        }
        winners
        initialState
        patches
      }
      ... on GameCanceled {
        gameID,
        version
      }
      # ... on PlayerConnection {
      #   playerID
      #   connected
      # }
    }
  }
`)

export function useGame(gameID?: Maybe<string>) {
  // const { data, loading, error } = useRestartingSubscription<gqlTypes.GameSubscription>(
  //   gqlTypes.GameDocument,
  //   {
  //     variables: { gameID },
  //     skip: !gameID,
  //     shouldResubscribe: true,
  //   }
  // );

  const client = useContext(RunnerClientContext);
  const { data, loading, error } = useSubscription(GameSubscription, {
    variables: { gameID: gameID as string },
    skip: !gameID,
    client
  });
  return data;

  // if (data) {
  //   if (data.game?.__typename === 'GameCanceled') {
  //     apolloClient.writeFragment({
  //       id: fullGameID(data.game.gameID),
  //       fragment: gqlTypes.GameCancelFragmentDoc,
  //       data: {
  //         canceled: true,
  //         version: data.game.version,
  //       },
  //     });
  //   } else if (data.game?.__typename === 'GamePatch') {
  //     const { version } = data.game;
  //     const modifiedGameID = fullGameID(data.game.gameID);
  //     const game = apolloClient.readFragment<gqlTypes.GameFragment>({
  //       id: modifiedGameID,
  //       fragment: gqlTypes.GameFragmentDoc,
  //     });

  //     if (version !== game?.version) {
  //       if (version !== (game?.version || 0) + 1) {
  //         throw new Error('Missing game version');
  //       }

  //       apolloClient.writeFragment({
  //         id: modifiedGameID,
  //         fragment: gqlTypes.GamePatchFragmentDoc,
  //         data: {
  //           patches: game?.patches.concat([data.game.patch]),
  //           version,
  //           winners: data.game.winners,
  //         },
  //       });
  //     }
  //   } else if (data.game?.__typename === 'PlayerConnection') {
  //     apolloClient.writeFragment<gqlTypes.PlayerFragment>({
  //       id: fullPlayerID(data.game.playerID),
  //       fragment: gqlTypes.PlayerFragmentDoc,
  //       data: {
  //         connected: data.game.connected,
  //       },
  //     });
  //   }
  // }

  // const result = useFragment<gqlTypes.GameFragment>({
  //   id: fullGameID(gameID),
  //   fragment: gqlTypes.GameFragmentDoc,
  // });

  // return { game: result || undefined };
}

function fullGameID(gameID?: Maybe<GameID>) {
  return gameID ? `Game:${gameID}` : undefined;
}

function fullPlayerID(playerID?: Maybe<gqlTypes.PlayerID>) {
  return playerID ? `Player:${playerID}` : undefined;
}
