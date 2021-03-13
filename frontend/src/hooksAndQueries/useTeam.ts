import { useQuery } from "@apollo/client";
import { useAuthenticatedUser } from "./authenticatedUser";
import { TournamentID } from "../types/graphql";
import * as gqlTypes from '../types/graphql';

export default function useTeam(tournamentID: TournamentID) {
  const { authenticatedUser } = useAuthenticatedUser();

  const { loading, error, data } = useQuery<gqlTypes.GetTeamQuery>(gqlTypes.GetTeamDocument, {
    variables: {
      userID: authenticatedUser ? authenticatedUser.id : null,
      tournamentID,
    },
    skip: !authenticatedUser || !authenticatedUser.id || !tournamentID
  });

  let userNotPartOfAnyTeam = undefined;
  let team: gqlTypes.Team = undefined;

  if (data?.team && gqlTypes.isTeam(data?.team)) {
    team = data?.team;
  } else if (data?.team && gqlTypes.isUserNotPartOfAnyTeam) {
    userNotPartOfAnyTeam = true
  }

  return { team, userNotPartOfAnyTeam, loading, error };
}