import { useCallback, useEffect } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useMutation, gql } from '@apollo/client';

export default function useGame() {
    const GAME_QUERY = gql`
      query GetGame {
      game
      }
    `;
  
    const MY_DATA_PATCHED = gql`
      subscription onGameChanges {
        gamePatch
      }
    `;
    const { subscribeToMore, loading, error, data } = useQuery(GAME_QUERY);
  
    useEffect(() => {
      const unsubscribe = subscribeToMore({
          document: MY_DATA_PATCHED,
          updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const patch = subscriptionData.data.gamePatch;
              const newDoc = applyPatch(prev.game, patch, false, false);
              return { game: newDoc.newDocument };
          }
      })
      return () => unsubscribe();
    }, [])


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


    return { subscribeToMore, playAction, loading, error, data };
  }
  
  