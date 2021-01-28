import { useCallback } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';

export default function useDebugGame() {
  const GAME_QUERY = gql`
    query GetGame {
      debugGame {
        id
        game {
          id
          version,
          players {
            playerNumber, token
          }
          gameState
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GAME_QUERY);
  useGameScheduleSubscription(data?.debugGame?.id);
  useGameSubscription(data?.debugGame?.game?.id);

  const playAction = usePlayAction(data?.debugGame.game);
  const createDebugGame = useCreateDebugGame();

  return { playAction, createDebugGame, loading, error, data: data?.debugGame.game };
}


function useGameScheduleSubscription(scheduleID: string) {
  const GAME_SCHEDULE_SUBSCRIPTION = gql`
    subscription onGameScheduleChanges($scheduleID: ID!) {
      gameScheduleChanges(scheduleID: $scheduleID) {
        id
        game {
          id
          version,
          players {
            playerNumber, token
          }
          gameState
        }
      }
    }
  `;

  const {error} = useSubscription(GAME_SCHEDULE_SUBSCRIPTION, {
    variables: { scheduleID: scheduleID },
    skip: !scheduleID,
    shouldResubscribe: true,
  });
}


function useGameSubscription(gameID: string) {

  const GAME_PATCH_SUBSCRIPTION = gql`
    subscription onGameChanges($gameID: ID!) {
      gamePatch(gameID: $gameID) {
        gameID, version, patch
      }
    }
  `;

  useSubscription(GAME_PATCH_SUBSCRIPTION, {
    variables: { gameID: gameID },
    skip: !gameID,
    shouldResubscribe: true,
    onSubscriptionData: ({ subscriptionData, client }) => {
      if (subscriptionData.error) {
        console.log(subscriptionData.error); // never called
      } else if (subscriptionData.data) {
        const { patch, version } = subscriptionData.data.gamePatch;
        const fullGameID = `Game:${gameID}`;
        const currentGame = client.readFragment({
          id: fullGameID,
          fragment: gql`
            fragment PatchedGame on Game {
              version
              gameState
            }
          `,
        });

        if (version !== currentGame.version + 1) {
          client.cache.evict({ id: fullGameID })
          return;
        }

        const newGameState = applyPatch(currentGame.gameState, patch, false, false).newDocument;

        client.writeFragment({
          id: fullGameID,
          fragment: gql`
            fragment PatchedGame on Game {
              gameState
            }
          `,
          data: {
            gameState: newGameState,
            version: version
          },
        });
      }
    },
  });
}

function usePlayAction(game) {

  const ACTION_MUTATION = gql`
    mutation Play($gameID: ID!, $player: Int!, $action: String!, $data: JSON!) {
      play(gameID: $gameID, player: $player, action: $action, data: $data)
    }
  `;

  const [playMutation, result/*{ playLoading, playError }*/] = useMutation<any, any>(ACTION_MUTATION);

  const playAction = useCallback(
    (action, data) =>  {
      console.log("Playing " + action);
      const player = game.gameState.players.findIndex((player) => player.playing);
      playMutation({ variables: { gameID: game.id, player: player, action, data } });
    }
  , [playMutation, game]);

  return playAction;
}


function useCreateDebugGame() {

  const NEW_DEBUG_GAME_MUTATION = gql`
    mutation CreateNewDebugGame {
      createNewDebugGame {
        id
        game {
          id
          version,
          players {
            playerNumber, token
          }
          gameState
        }
      }
    }
  `;

  const [createNewDebugGameMutation, newDebugGame/*{ playLoading, playError }*/] = useMutation<any, any>(NEW_DEBUG_GAME_MUTATION);

  const createDebugGame = useCallback(
    () =>  {
      createNewDebugGameMutation();
    }
  , [createNewDebugGameMutation]);

  return createDebugGame;
}