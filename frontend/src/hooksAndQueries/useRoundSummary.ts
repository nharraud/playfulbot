import { useQuery } from "@apollo/client";
import { RoundID, TeamID } from "../types/graphql";
import * as gqlTypes from '../types/graphql';

export default function useRoundSummary(roundID: RoundID, teamID: TeamID) {
  const { data } = useQuery<gqlTypes.RoundSummaryQuery>(gqlTypes.RoundSummaryDocument, {
    variables: {
      roundID,
      teamID,
    },
    skip: !roundID || !teamID
  });

  return { round: data?.round };
}