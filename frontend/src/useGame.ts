import { useCallback, useEffect } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useMutation, gql, ApolloError } from '@apollo/client';
import { ErrorSharp } from '@material-ui/icons';

export default function useGame(gameID: string, debug: boolean) {

  let GAME_QUERY;
  // if (!debug) {
  //   GAME_QUERY = gql`
  //     query GetGame {
  //       game(gameID)
  //     }
  //   `;
  // } else {
    GAME_QUERY = gql`
      query GetGame {
        debugGame {
          id
          players {
            playerNumber, token
          }
          gameState
        }
      }
  `;
  // }
  
    const { subscribeToMore, loading, error, data, refetch } = useQuery(GAME_QUERY);
  
    useEffect(() => {
      if (!data) {
        return;
      }

      const gameID = data.debugGame?.id || data.game.id;
      const MY_DATA_PATCHED = gql`
        subscription onGameChanges($gameID: ID!) {
          gamePatch(gameID: $gameID) {
            gameID, version, patch
          }
        }
      `;

      const unsubscribe = subscribeToMore({
          document: MY_DATA_PATCHED,
          variables: { gameID: gameID },
          updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const patch = subscriptionData.data.gamePatch.patch;
              const queryRoot = debug ? 'debugGame' : 'game';
              if (subscriptionData.data.gamePatch.version > prev[queryRoot].version ||
                  subscriptionData.data.gamePatch.gameID !== prev[queryRoot].id) {
                refetch();
                return prev;
              }
              const newGame = {}
              newGame[queryRoot] = { ...prev[queryRoot] }
              newGame[queryRoot].gameState = applyPatch(prev[queryRoot].gameState, patch, false, false).newDocument;
              console.log(newGame[queryRoot].gameState)
              newGame[queryRoot].version = subscriptionData.data.gamePatch.version
              return newGame;
          },
          onError(error: ApolloError) {
            if (!error.graphQLErrors) {
              throw error;
            }
            let haneledErrors = 0;
            for (const err of error.graphQLErrors) {
              if (err.extensions?.code === 'NOT_FOUND') {
                refetch()
                haneledErrors += 1;
              }
            }
            if (error.graphQLErrors.length !== haneledErrors) {
              throw error;
            }
          }
      })
      return () => unsubscribe();
    }, [loading, error, data?.debugGame?.id, data?.game?.id])

    const gameData = data?.game || data?.debugGame;

    const ACTION_MUTATION = gql`
      mutation Play($gameID: ID!, $player: Int!, $action: String!, $data: JSON!) {
        play(gameID: $gameID, player: $player, action: $action, data: $data)
      }
    `;

    const [playMutation, result/*{ playLoading, playError }*/] = useMutation<any, any>(ACTION_MUTATION);

    const playAction = useCallback(
      (action, data) =>  {
        console.log("Playing " + action);
        const player = gameData.gameState.players.findIndex((player) => player.playing);
        playMutation({ variables: { gameID: gameData.id, player: player, action, data } });
      }
    , [playMutation, data]);


    return { subscribeToMore, playAction, loading, error, data: gameData };
  }
  
  