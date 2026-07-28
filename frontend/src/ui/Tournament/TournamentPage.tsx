import React, { useCallback } from 'react';
import cssCls from './TournamentPage.module.scss';

import { Routes, Route, Link, useMatch,/*useRouteMatch,*/ useParams } from 'react-router';

import { useTournament } from 'src/hooksAndQueries/backend/graphql/useTournament';
import { GetTeamQuery, TournamentQuery, TournamentStatus } from 'src/types/backend/graphql/graphql';
import { useTeam } from 'src/hooksAndQueries/backend/graphql/team';
import LoadingWidget from '../Loading';
// import CompetitionSubPage from './competition/CompetitionSubPage';
import TeamSubPage from './team/TeamSubPage';
import TournamentInfoSubPage from './tournamentInfo/TournamentInfoSubPage';
import GameRulesSubPage from './gameRules/GameRulesSubPage';
import CodingBotSubPage from './codingBot/CodingBotSubPage';
import ConfigurationSubPage from './configuration/ConfigurationSubPage';
import Debug from './Debug';
import MenuBar from '../MenuBar/MenuBar';
import TeamArenasSubPage from './arenas/TeamArenasSubPage';
import { FormattedMessage } from 'react-intl';
import { TallHeader } from '../components/header/TallHeader';

export interface MatchParams {
  tournamentID: string;
  page: string;
}

interface TournamentPageProps {
  tournament: Exclude<TournamentQuery['tournament'], null>;
  team?: GetTeamQuery['team'];
}

export default function TournamentPage({ tournament, team }: TournamentPageProps) {
  const match = useMatch('/tournament/:tournamentID/:page');
  const baseURL = `/tournament/${match?.params?.tournamentID}`;

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
  content = (
    <div className={cssCls.tournamentPage}>
      <aside className={cssCls.menuAside}>
        <nav className={cssCls.menu}>
          <Link to={`${baseURL}/info`} className={`${cssCls.instructions} ${activeClass('info')}`}>
            <i/><FormattedMessage defaultMessage="Introduction"/>
          </Link>
          <Link to={`${baseURL}/rules`} className={`${cssCls.gameRules} ${activeClass('rules')}`}>
            <i/><FormattedMessage defaultMessage="Game Rules"/>
          </Link>
          <Link to={`${baseURL}/coding`} className={`${cssCls.codingBot} ${activeClass('coding')}`}>
            <i/><FormattedMessage defaultMessage="Coding a Bot"/>
          </Link>
          <Link to={`${baseURL}/team`} className={`${cssCls.teamButton} ${activeClass('team')}`}>
            <i/><FormattedMessage defaultMessage="Teams"/>
          </Link>
          {tournament.status === TournamentStatus.Started && team && (
            <Link to={`${baseURL}/arenas`} className={`${cssCls.teamArenas} ${activeClass('arenas')}`}>
              <i/><FormattedMessage defaultMessage="Arenas"/>
            </Link>
          )}
          {tournament.status === TournamentStatus.Started && (
            <Link to={`${baseURL}/competition`} className={`${cssCls.competition} ${activeClass('competition')}`}>
              <i/><FormattedMessage defaultMessage="Competition"/>
            </Link>
          )}
          <Link to={`${baseURL}/configuration`} className={`${cssCls.configuration} ${activeClass('configuration')}`}>
            <i/><FormattedMessage defaultMessage="Configuration"/>
          </Link>
        </nav>
      </aside>
      <main className={cssCls.subPage} style={{ overflow: 'hidden' }}>
        <Routes>
          <Route path={`/info`} element={<TournamentInfoSubPage tournament={tournament} />}/>
          <Route path={`/rules`} element={<GameRulesSubPage />}/>
          <Route path={`/coding`} element={<CodingBotSubPage />}/>
          <Route path={`/team`} element={<TeamSubPage tournament={tournament} />}/>
          <Route path={`/arenas`} element={<TeamArenasSubPage tournament={tournament} />}/>
          <Route path={`/configuration`} element={<ConfigurationSubPage tournament={tournament} />}/>
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


  const backLinkText = (<FormattedMessage
    defaultMessage="Tournaments"
  />);

  return (
    <div>
      <TallHeader title={tournament?.name} backLink={{ url: '/home', text: backLinkText }}/>
      <div className={cssCls.mainContainer}>
        {content}
      </div>
    </div>
  );
}
