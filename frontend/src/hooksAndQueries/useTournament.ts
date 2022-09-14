import { useTournamentQuery } from '../types/graphql';

export function useTournament(id: string) {
  const { loading, error, data } = useTournamentQuery({
    skip: !id,
    variables: { tournamentID: id },
  });
  return { loading, error, tournament: data ? data.tournament : null };
}
