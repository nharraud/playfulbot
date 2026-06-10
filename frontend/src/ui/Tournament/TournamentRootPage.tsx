import { Routes, Route, useParams } from 'react-router';

import { useTournament } from 'src/hooksAndQueries/backend/graphql/useTournament';
import { useTeam } from 'src/hooksAndQueries/backend/graphql/team';
import LoadingWidget from '../Loading';
import ArenaPage from './arenas/ArenaPage';
import TournamentPage from './TournamentPage';

export default function TournamentRootPage() {
  const { tournamentID } = useParams<{ tournamentID: string }>();

  const { loading, error, tournament } = useTournament(tournamentID);
  const { team } = useTeam(tournamentID);

  let content;
  if (loading) {
    content = <LoadingWidget />;
  } else if (error) {
    content = <p>{error.message}</p>;
  } else if (!tournament) {
    content = <p>{'404 Tournament not found'}</p>;
  } else {
    content = (
      <Routes>
        <Route path={`/arenas/:arenaid`} element={<ArenaPage tournament={tournament} />}/>
        <Route path={`/*`} element={<TournamentPage tournament={tournament} team={team} />}/>
      </Routes>
    )
  }
  return content;
}