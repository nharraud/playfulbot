import { useCallback, useEffect } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useMutation, gql } from '@apollo/client';

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
  
    const { subscribeToMore, loading, error, data } = useQuery(GAME_QUERY);
  
    useEffect(() => {
      if (!data) {
        return;
      }

      const gameID = data.debugGame?.id || data.game.id;
      const MY_DATA_PATCHED = gql`
        subscription onGameChanges($gameID: ID!) {
          gamePatch(gameID: $gameID)
        }
      `;
      const unsubscribe = subscribeToMore({
          document: MY_DATA_PATCHED,
          variables: { gameID: gameID },
          updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const patch = subscriptionData.data.gamePatch;
              if (debug) {
                const newGame = { debugGame: { ...prev.debugGame } }
                newGame.debugGame.gameState = applyPatch(prev.debugGame.gameState, patch, false, false).newDocument;
                return newGame;
              } else {
                const newGame = { game: { ...prev.debugGame } }
                newGame.game.gameState = applyPatch(prev.game.gameState, patch, false, false).newDocument;
                return newGame;
              }
          }
      })
      return () => unsubscribe();
    }, [data])


    const ACTION_MUTATION = gql`
      mutation Play($action: String!, $data: JSON!) {
        play(action: $action, data: $data)
      }
    `;

    const [playMutation, result/*{ playLoading, playError }*/] = useMutation<any, any>(ACTION_MUTATION);

    const playAction = useCallback(
      (action, data) =>  {
        console.log("Playing " + action)
        playMutation({ variables: { action, data } });
      }
    , [playMutation]);


    return { subscribeToMore, playAction, loading, error, data: data?.game || data?.debugGame };
  }
  
  