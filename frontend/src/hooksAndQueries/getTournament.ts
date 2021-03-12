import { useQuery, gql } from '@apollo/client';
import { Tournament } from 'src/types/graphql';

const TOURNAMENT_QUERY = gql`
    query getTournament($tournamentID: ID!) {
        tournament(tournamentID: $tournamentID) {
          id, name
        }
    }
`;

interface Result {
  tournament: Tournament
}

export function useTournament(id: string) {
    const { loading, error, data } = useQuery<Result>(TOURNAMENT_QUERY, {
      skip: !id,
      variables: { tournamentID: id }
    });
    return { loading, error, tournament: data ? data.tournament: null };
};
