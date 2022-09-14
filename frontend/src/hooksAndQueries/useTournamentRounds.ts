import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { TournamentID } from '../types/graphql';
import * as gqlTypes from '../types/graphql';

export default function useTournamentRounds(tournamentID: TournamentID) {
  const { loading, error, data, fetchMore } = useQuery<gqlTypes.TournamentRoundsQuery>(
    gqlTypes.TournamentRoundsDocument,
    {
      variables: {
        maxSize: 5,
        tournamentID,
      },
      skip: !tournamentID,
    }
  );

  const fetchPreviousRounds = useCallback(() => {
    fetchMore({
      variables: {
        maxSize: 5,
        before: data?.tournament.rounds[0].startDate,
        tournamentID,
      },
    });
  }, [tournamentID, data]);

  return { tournament: data?.tournament, fetchPreviousRounds };
}
