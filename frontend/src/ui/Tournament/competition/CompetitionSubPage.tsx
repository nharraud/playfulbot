import React from 'react';
import { Grid, makeStyles, Paper } from "@material-ui/core";
import { Tournament } from "src/types/graphql-generated";
import TeamBotStatus from './TeamBotStatus';
import RoundsTimeline from './RoundsTimeline';

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

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={9}>
        <RoundsTimeline tournament={props.tournament}/>
      </Grid>
      <Grid item xs={3}>
        <TeamBotStatus tournament={props.tournament}/>
      </Grid>
    </Grid>
  )
}
