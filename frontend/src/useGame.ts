import { useCallback } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { useAuthenticatedUser } from './hooksAndQueries/authenticatedUser';

export default function useDebugGame() {
  const { authenticatedUser } = useAuthenticatedUser();

  const GAME_QUERY = gql`
    query GetGame($userID: ID!) {
      debugGame(userID: $userID) {
        id
        players {
          id, token
        }
        game {
          id
          version,
          assignments {
            playerID, playerNumber
          }
          gameState
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GAME_QUERY, {
    variables: { userID: authenticatedUser ? authenticatedUser.id : null },
    skip: !authenticatedUser || !authenticatedUser.id
  });
  useGameScheduleSubscription(data?.debugGame?.id);
  useGameSubscription(data?.debugGame?.game?.id);

  const playAction = usePlayAction(data?.debugGame.game);
  const createDebugGame = useCreateDebugGame();

  return { playAction, createDebugGame, loading, error, gameSchedule: data?.debugGame };
}


function useGameScheduleSubscription(scheduleID: string) {
  const GAME_SCHEDULE_SUBSCRIPTION = gql`
    subscription onGameScheduleChanges($scheduleID: ID!) {
      gameScheduleChanges(scheduleID: $scheduleID) {
        id
        players {
          id, token
        }
        game {
          id
          version,
          assignments {
            playerID, playerNumber
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

        ... on GamePatch {
          gameID, version, patch
        }
        ... on Game {
          id
          version,
          assignments {
            playerID, playerNumber
          }
          gameState
        }
      }
    }
  `;

  const result = useSubscription(GAME_PATCH_SUBSCRIPTION, {
    variables: { gameID: gameID },
    skip: !gameID,
    shouldResubscribe: true,
    onSubscriptionData: ({ subscriptionData, client }) => {
      if (subscriptionData.error) {
        console.log(subscriptionData.error); // never called
      } else if (subscriptionData.data) {
        if (subscriptionData.data.gamePatch.__typename === 'Game') {
          return subscriptionData;
        }

        const version = subscriptionData.data.gamePatch.version;
        const patch = subscriptionData.data.gamePatch.patch;
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
              version
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
    mutation Play($gameID: ID!, $playerID: ID!, $action: String!, $data: JSON!) {
      play(gameID: $gameID, playerID: $playerID, action: $action, data: $data)
    }
  `;

  const [playMutation, result/*, { playLoading, playError }*/] = useMutation<any, any>(ACTION_MUTATION);
  console.log(result);

  const playAction = useCallback(
    (action, data) =>  {
      console.log("Playing " + action);
      const playerNumber = game.gameState.players.findIndex((player) => player.playing);
      const assignment = game.assignments.find((assign) => assign.playerNumber === playerNumber)
      playMutation({ variables: { gameID: game.id, playerID: assignment.playerID, action, data } });
    }
  , [playMutation, game]);

  return playAction;
}


function useCreateDebugGame() {

  const NEW_DEBUG_GAME_MUTATION = gql`
    mutation CreateNewDebugGame {
      createNewDebugGame {
        id
        players {
          id, token
        }
        game {
          id
          version,
          assignments {
            playerID, playerNumber
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