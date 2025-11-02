import { useQuery } from '@apollo/client/react';

import { graphql } from '../../../types/backend/graphql';
 
const authenticatedUserTournamentsQuery = graphql(`
  query authenticatedUserTournaments {
    authenticatedUser {
      id,
      username,
      teams {
        id,
        name,
        tournament {
          id,
          name,
          # lastRoundDate,
          status,
        }
      }
      tournamentInvitations {
        tournament {
          id,
          name,
          # lastRoundDate,
          status,
        }
      }
      organizedTournaments {
        id,
        name,
        # lastRoundDate,
        status,
      }
    }
  }
`)

export function useAuthenticatedUserTournaments() {

  const { error, data, refetch } = useQuery(
    authenticatedUserTournamentsQuery
  );

  return { data, error, refetch };
}
