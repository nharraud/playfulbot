import React from 'react';
import { Grid, makeStyles, Paper } from "@material-ui/core";
import { Tournament } from "src/types/graphql-generated";
import TeamBotStatus from './TeamBotStatus';
import RoundsTimeline from './RoundsTimeline';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';
import RoundSubPage from '../round/RoundsSubPage';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 42,
    color: theme.palette.text.secondary,
    height: 140,
    width: 100,
  },
}));

interface CompetitionSubPageProps {
  tournament: Tournament | undefined;
}

export default function CompetitionSubPage(props: CompetitionSubPageProps) {
  const classes = useStyles();
  const match = useRouteMatch({
    path: "/tournament/:tournamentID",
    strict: true,
    sensitive: true
  });

  return (
    <Switch>
      <Route exact path={`${match.url}/competition`}>
        <Grid container className={classes.root} spacing={3}>
          <Grid item lg={8}>
            <RoundsTimeline tournament={props.tournament}/>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={3}>
            <TeamBotStatus tournament={props.tournament}/>
          </Grid>
        </Grid>
      </Route>
      <Route path={`${match.url}/competition/rounds/:roundID`}>
        <RoundSubPage tournament={props.tournament}/>
      </Route>
    </Switch>
  )
}
