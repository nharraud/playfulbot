import { useQuery } from "@apollo/client";
import { useAuthenticatedUser } from "./authenticatedUser";
import { TournamentID } from "../types/graphql";
import * as gqlTypes from '../types/graphql';

export default function useTeam(tournamentID?: TournamentID) {
  const { authenticatedUser } = useAuthenticatedUser();
  const skip = !authenticatedUser || !authenticatedUser.id || !tournamentID;
  const { loading, error, data, refetch } = useQuery<gqlTypes.GetTeamQuery>(gqlTypes.GetTeamDocument, {
    variables: {
      userID: authenticatedUser ? authenticatedUser.id : null,
      tournamentID,
    },
    skip
  });

  let userNotPartOfAnyTeam = undefined;
  let team: gqlTypes.Team | undefined = undefined;

  if (data?.team && gqlTypes.isTeam(data?.team)) {
    team = data?.team;
  } else if (data?.team && gqlTypes.isUserNotPartOfAnyTeam) {
    userNotPartOfAnyTeam = true
  }

  return { team, userNotPartOfAnyTeam, loading: loading || skip, error, refetch };
}