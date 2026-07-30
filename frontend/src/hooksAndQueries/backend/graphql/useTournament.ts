import { graphql } from '../../../types/backend/graphql';
import { useQuery } from '@apollo/client/react';
 
const tournamentQuery = graphql(`
  query tournament($tournamentID: ID!) {
    tournament(tournamentID: $tournamentID) {
      id
      name
      status
      startDate
      endDate
      # firstRoundDate
      # lastRoundDate
      # roundsNumber
      # minutesBetweenRounds
      myRole
      # invitationLinkID
    }
  }
`);


export function useTournament(id: string) {
  const { loading, error, data } = useQuery(tournamentQuery, {
    skip: !id,
    variables: { tournamentID: id },
  });
  return { loading, error, tournament: data ? data.tournament : null };
}
