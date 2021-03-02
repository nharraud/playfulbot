import { gql, useQuery } from "@apollo/client";
import { useAuthenticatedUser } from "./hooksAndQueries/authenticatedUser";
import { Team } from "./types/graphql";

export default function useTeam() {
  const { authenticatedUser } = useAuthenticatedUser();

  const TEAM_QUERY = gql`
    query GetTeam($userID: ID!) {
      team(userID: $userID) {
        id
        members {
          id
          username
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(TEAM_QUERY, {
    variables: { userID: authenticatedUser ? authenticatedUser.id : null },
    skip: !authenticatedUser || !authenticatedUser.id
  });

  const team: Team = data?.team;

  return { team, loading, error };
}