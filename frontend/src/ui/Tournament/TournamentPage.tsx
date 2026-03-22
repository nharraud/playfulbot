import React, { useCallback } from 'react';
import cssCls from './TournamentPage.module.css';

import { Routes, Route, Link, useMatch,/*useRouteMatch,*/ useParams } from 'react-router';

import { useTournament } from 'src/hooksAndQueries/backend/graphql/useTournament';
import { TournamentStatus } from 'src/types/backend/graphql/graphql';
import { useTeam } from 'src/hooksAndQueries/backend/graphql/team';
import LoadingWidget from '../Loading';
// import CompetitionSubPage from './competition/CompetitionSubPage';
import TeamSubPage from './team/TeamSubPage';
import InfoSubPage from './info/InfoSubPage';
import Debug from './Debug';
import MenuBar from '../MenuBar/MenuBar';
import TeamArenasSubPage from './arenas/TeamArenasSubPage';
import ArenaSubPage from './arenas/ArenaSubPage';
import { Header } from '../components/header/Header';
import { FormattedMessage } from 'react-intl';

export interface MatchParams {
  tournamentID: string;
  page: string;
}

export default function TournamentPage() {
  const match = useMatch('/tournament/:tournamentID/:page');
  const baseURL = `/tournament/${match?.params?.tournamentID}`;
  const arenaMatch = useMatch('/tournament/:tournamentID/arenas/:arenaID');

  const { tournamentID } = useParams<{ tournamentID: string }>();

  const { loading, error, tournament } = useTournament(tournamentID);
  const { team } = useTeam(tournamentID);

  const activeClass = useCallback(
    (page: string) => {
      if (match?.params?.page === page) {
        return cssCls.activeButton;
      }
      return '';
    },
    [match?.params, cssCls]
  );

  let content;
  if (tournament) {
    content = (
      <div className={cssCls.tournamentPage}>
        <div className={cssCls.menu}>
          <Link to={`${baseURL}/info`} className={`${cssCls.instructions} ${activeClass('info')}`}/>
          <Link to={`${baseURL}/team`} className={`${cssCls.teamButton} ${activeClass('team')}`}/>
          {tournament.status === TournamentStatus.Started && team && (
            <Link to={`${baseURL}/arenas`} className={`${cssCls.teamArenas} ${activeClass('arenas')}`}/>
          )}
          {tournament.status === TournamentStatus.Started && (
            <Link to={`${baseURL}/competition`} className={`${cssCls.competition} ${activeClass('competition')}`}/>
          )}
        </div>
        <main className={cssCls.subPage} style={{ overflow: 'hidden' }}>
          <Routes>
            <Route path={`/info`} element={<InfoSubPage tournament={tournament} />}/>
            <Route path={`/team`} element={<TeamSubPage tournament={tournament} />}/>
            <Route path={`/arenas`} element={<TeamArenasSubPage tournament={tournament} />}/>
            <Route path={`/arenas/:arenaid`} element={<ArenaSubPage tournament={tournament} />}/>
            {/* <Route path={`${baseURL}/arenas/*`}>
              <Debug tournament={tournament} arenaId={arenaMatch?.params?.arenaID} />
            </Route> */}
            {/* <Route path={`${baseURL}/competition`}>
              <CompetitionSubPage tournament={tournament} />
            </Route> */}
          </Routes>
        </main>
      </div>
    );
  } else if (loading) {
    content = <LoadingWidget />;
  } else if (error) {
    content = <p>{error.message}</p>;
  }


  const backLinkText = (<FormattedMessage
    defaultMessage="Tournaments"
  />);

  return (
    <div>
      <Header title={tournament?.name} backLink={{ url: '/home', text: backLinkText }}/>
      {/* <MenuBar
        location={tournament ? `${tournament.name} tournament` : undefined}
        showTournaments={true}
      /> */}
      {content}
    </div>
  );
}
