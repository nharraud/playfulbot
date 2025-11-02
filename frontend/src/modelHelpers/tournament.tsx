import { Tournament, TournamentStatus } from 'src/types/backend/graphql/graphql';
import { DateTime } from 'luxon';

export function tournamentStatusToText(tournament: Tournament) {
  const timeUntilLastRound = DateTime.fromISO(tournament.lastRoundDate);
  switch (tournament.status) {
    case TournamentStatus.Created: {
      return `starts ${timeUntilLastRound.toRelative()}`;
    }
    case TournamentStatus.Started: {
      return `started ${timeUntilLastRound.toRelative()}`;
    }
    case TournamentStatus.Ended: {
      return `Ended`;
    }
  }
}
