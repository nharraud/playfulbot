import { gql, useQuery } from "@apollo/client";
import { useAuthenticatedUser } from "./hooksAndQueries/authenticatedUser";
import { Team, TournamentID } from "./types/graphql";

export default function useTeam(tournamentID: TournamentID) {
  const { authenticatedUser } = useAuthenticatedUser();

  const TEAM_QUERY = gql`
    query GetTeam($userID: ID!, $tournamentID: ID!) {
      team(userID: $userID, tournamentID: $tournamentID) {
        id
        name
        members {
          id
          username
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(TEAM_QUERY, {
    variables: {
      userID: authenticatedUser ? authenticatedUser.id : null,
      tournamentID,
    },
    skip: !authenticatedUser || !authenticatedUser.id || !tournamentID
  });

  const team: Team = data?.team;

  return { team, loading, error };
}