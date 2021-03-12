import { useQuery, useMutation, gql, FetchResult } from '@apollo/client';
import { useCallback } from 'react';
import { Tournament } from 'src/types/graphql';


const CREATE_TOURNAMENT_MUTATION = gql`
  mutation createTournament($name: String!) {
      createTournament(name: $name) {
          id
          name
      }
  }
`;

interface Response {
  createTournament: Tournament;
}

export function useCreateTournament() {
    const [createTournament, result] = useMutation<Response>(CREATE_TOURNAMENT_MUTATION);

    const createTournamentCallback = useCallback(
        (name: string) => createTournament({ variables: { name } }),
         [createTournament]
    );
    return { createTournament: createTournamentCallback, result }
};