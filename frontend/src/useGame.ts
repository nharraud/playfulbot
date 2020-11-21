import { useEffect } from 'react';
import { applyPatch } from 'fast-json-patch';
import { useQuery, useSubscription, gql } from '@apollo/client';

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
              const newDoc = applyPatch(prev, patch, false, false);
              return newDoc.newDocument;
          }
      })
      return () => unsubscribe();
    }, [])
    return { subscribeToMore, loading, error, data };
  }
  
  