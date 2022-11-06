import React, { useCallback } from 'react';

import { Switch, Route, Link, useRouteMatch, useParams } from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import PeopleIcon from '@mui/icons-material/People';

import CompetitionIcon from '@mui/icons-material/EmojiEvents';
import TestIcon from '@mui/icons-material/SlowMotionVideo';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTournament } from 'src/hooksAndQueries/useTournament';
import { TournamentStatus } from 'src/types/graphql-generated';
import useTeam from 'src/hooksAndQueries/useTeam';
import LoadingWidget from '../Loading';
import CompetitionSubPage from './competition/CompetitionSubPage';
import TeamSubPage from './team/TeamSubPage';
import InfoSubPage from './info/InfoSubPage';
import Debug from './Debug';
import MenuBar from '../MenuBar/MenuBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    minHeight: 0,
  },
  hide: {
    display: 'none',
  },
  tournamentMenu: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
    '& > a': {
      margin: '0.5rem',
      padding: '0.5rem',
    },
  },
  menuIcon: {
    fontSize: '3em',
    verticalAlign: 'middle',
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
  },
  menuLink: {
    color: 'white',
  },
  activeMenuLink: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.getContrastText(theme.palette.grey[100]),
    borderRadius: '100px',
  },
}));

export interface MatchParams {
  tournamentID: string;
  page: string;
}

export default function TournamentPage() {
  const match = useRouteMatch<MatchParams>('/tournament/:tournamentID/:page');
  const baseURL = `/tournament/${match.params.tournamentID}`;

  const { tournamentID } = useParams<{ tournamentID: string }>();

  const { loading, error, tournament } = useTournament(tournamentID);
  const { team } = useTeam(tournamentID);

  const classes = useStyles();

  const className = useCallback(
    (page: string) => {
      if (match.params?.page === page) {
        return classes.activeMenuLink;
      }
      return classes.menuLink;
    },
    [match.params, classes]
  );

  let content;
  if (tournament) {
    content = (
      <>
        <div className={classes.tournamentMenu}>
          <Link to={`${baseURL}/info`} className={className('info')}>
            <MenuBookIcon className={classes.menuIcon} />
          </Link>
          <Link to={`${baseURL}/team`} className={className('team')}>
            <PeopleIcon className={classes.menuIcon} />
          </Link>
          {tournament.status === TournamentStatus.Started && team && (
            <Link to={`${baseURL}/debug`} className={className('debug')}>
              <TestIcon className={classes.menuIcon} />
            </Link>
          )}
          {tournament.status === TournamentStatus.Started && (
            <Link to={`${baseURL}/competition`} className={className('competition')}>
              <CompetitionIcon className={classes.menuIcon} />
            </Link>
          )}
        </div>
        <main className={classes.main} style={{ overflow: 'hidden' }}>
          <Switch>
            <Route path={`${baseURL}/info`}>
              <InfoSubPage tournament={tournament} />
            </Route>
            <Route path={`${baseURL}/team`}>
              <TeamSubPage tournament={tournament} />
            </Route>
            <Route path={`${baseURL}/debug`}>
              <Debug tournament={tournament} />
            </Route>
            <Route path={`${baseURL}/competition`}>
              <CompetitionSubPage tournament={tournament} />
            </Route>
          </Switch>
        </main>
      </>
    );
  } else if (loading) {
    content = <LoadingWidget />;
  } else if (error) {
    content = <p>{error.message}</p>;
  }

  return (
    <div className={classes.root}>
      <MenuBar
        location={tournament ? `${tournament.name} tournament` : undefined}
        showTournaments={true}
      />
      <div className={classes.content}>{content}</div>
    </div>
  );
}
