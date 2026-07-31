import { useQuery } from '@apollo/client/react';
import { graphql } from '../../../types/backend/graphql';

const gameDefinitionsQuery = graphql(`
  query getGameDefinitions {
    gameDefinitions { id, name }
  }
`);

export function useGameDefinitions() {
  const { loading, error, data } = useQuery(gameDefinitionsQuery);
  return { loading, error, gameDefinitions: data ? data.gameDefinitions : [] };
}
