import { useCallback, useContext } from 'react';
import { useMutation, useSubscription, useFragment } from '@apollo/client/react';
import { Maybe } from 'graphql/jsutils/Maybe';
import { GameID } from 'playfulbot-game';
import { useAuthenticatedUser } from '../../backend/graphql/authenticatedUser';
import { Tournament } from '../../../types/graphql';
import { RunnerClientContext } from 'src/infrastructure/graphql/GraphqlClientContexts'
import { graphql } from '../../../types/game-runner/graphql';

import * as gqlTypes from '../../../types/graphql';

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


const GameCancelFragment = graphql(`
  fragment GameCancel on Game {
    version
    canceled
  }
`);

const GameFragment = graphql(`
  fragment Game on Game {
    id
    version
    canceled
    players {
      id
      token
      connected
    }
    winners
    initialState
    patches
  }
`);

const GamePatchFragment = graphql(`
  fragment GamePatch on Game {
    version
    patches
    winners
  }
`);


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
  if (!client) {
    return;
  }
  const { data, loading, error } = useSubscription(GameSubscription, {
    variables: { gameID: gameID as string },
    skip: !gameID,
    client
  });
  // return data;

  if (data) {
    if (data.game?.__typename === 'GameCanceled') {
      client.writeFragment({
        id: fullGameID(data.game.gameID),
        fragment: GameCancelFragment,
        data: {
          canceled: true,
          version: data.game.version,
          __typename: "Game",
        },
      });
    } else if (data.game?.__typename === 'GamePatch') {
      const { version } = data.game;
      const modifiedGameID = fullGameID(data.game.gameID);
      const game = client.readFragment({
        id: modifiedGameID,
        fragment: GameFragment,
      });

      if (version !== game?.version) {
        if (version !== (game?.version || 0) + 1) {
          throw new Error('Missing game version');
        }

        client.writeFragment({
          id: modifiedGameID,
          fragment: GamePatchFragment,
          data: {
            patches: (game?.patches as object[]).concat([data.game.patch]),
            version,
            winners: data.game.winners,
            __typename: "Game",
          },
        });
      }
    }
  //   } else if (data.game?.__typename === 'PlayerConnection') {
  //     apolloClient.writeFragment<gqlTypes.PlayerFragment>({
  //       id: fullPlayerID(data.game.playerID),
  //       fragment: gqlTypes.PlayerFragmentDoc,
  //       data: {
  //         connected: data.game.connected,
  //       },
  //     });
  //   }
  }

  const result = useFragment({
    fragment: GameFragment,
    client,
    from: {
      __typename: "Game",
      id: gameID,
    },
  });

  return { game: result || undefined };
}

function fullGameID(gameID?: Maybe<GameID>) {
  return gameID ? `Game:${gameID}` : undefined;
}

function fullPlayerID(playerID?: Maybe<gqlTypes.PlayerID>) {
  return playerID ? `Player:${playerID}` : undefined;
}
