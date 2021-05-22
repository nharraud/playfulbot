import React from 'react';

import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import MenuBar from '../MenuBar/MenuBar';

import PeopleIcon from '@material-ui/icons/People';

import Debug from './Debug';
import InfoSubPage from './info/InfoSubPage';
import TeamSubPage from './team/TeamSubPage';
import CompetitionIcon from '@material-ui/icons/EmojiEvents';
import TestIcon from '@material-ui/icons/SlowMotionVideo';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { useTournament } from 'src/hooksAndQueries/useTournament';
import LoadingWidget from '../Loading';
import CompetitionSubPage from './competition/CompetitionSubPage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
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
    backgroundColor: theme.palette.grey[900],
    '& > a': {
      padding: theme.spacing(2),
    },
  },
  menuIcon: {
    fontSize: '3em',
    color: 'white'
  },
  main: {
    flex: "1 1 auto",
    display: 'flex',
  },
}));


export default function TournamentPage() {
  let match = useRouteMatch();

  const { tournamentID } = useParams<{tournamentID: string}>();

  const { loading, error, tournament } = useTournament(tournamentID);

  const classes = useStyles();

  let content = undefined;
  if (tournament) {
    content = (
      <>
        <div className={classes.tournamentMenu}>
          <Link to={`${match.url}/info`}>
            <MenuBookIcon className={classes.menuIcon}/>
            </Link>
          <Link to={`${match.url}/team`}>
            <PeopleIcon className={classes.menuIcon}/>
            </Link>
          <Link to={`${match.url}/debug`}>
            <TestIcon className={classes.menuIcon}/>
            </Link>
          <Link to={`${match.url}/competition`}>
            <CompetitionIcon className={classes.menuIcon}/>
            </Link>
        </div>
        <main
          className={classes.main}
        >
          <Switch>
            <Route path={`${match.url}/info`}>
              <InfoSubPage tournament={tournament} />
            </Route>
            <Route path={`${match.url}/team`}>
              <TeamSubPage tournament={tournament} />
            </Route>
            <Route path={`${match.url}/debug`}>
              <Debug tournament={tournament}/>
            </Route>
            <Route path={`${match.url}/competition`}>
              <CompetitionSubPage tournament={tournament}/>
            </Route>
          </Switch>
        </main>
      </>
    )
  } else if (loading) {
    content = <LoadingWidget/>
  } else if (error) {
    content = (
      <p>{ error.message }</p>
    )
  }

  return (
    <div className={classes.root}>
      <MenuBar location={tournament ? `${tournament.name} tournament` : undefined} />
      <div className={classes.content}>
      {content}
      </div>
    </div>
  )
}