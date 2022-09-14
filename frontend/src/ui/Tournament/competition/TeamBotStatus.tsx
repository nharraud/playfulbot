import React from 'react';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Tournament } from 'src/types/graphql-generated';
import useTeam from 'src/hooksAndQueries/useTeam';
import { useTeamPlayer } from 'src/hooksAndQueries/useTeamPlayer';
import CopyToClipboardButton from 'src/utils/CopyToClipboardButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
    width: '100%',
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: 'left',
  },
  grid: {},
  label: {
    textAlign: 'left',
    paddingTop: '0.5em',
  },
  value: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    paddingTop: '0.5em',
  },
}));

interface TeamBotStatusProps {
  tournament: Tournament | undefined;
}

export default function TeamBotStatus(props: TeamBotStatusProps) {
  const classes = useStyles();
  const { team } = useTeam(props.tournament?.id);
  const { player } = useTeamPlayer(team?.id);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom className={classes.title}>
              Team's bot
            </Typography>
          </Grid>
          <Grid item xs={5} className={classes.label}>
            <Typography variant="body1" gutterBottom>
              connected
            </Typography>
          </Grid>
          <Grid item xs={7} className={classes.value}>
            <Typography variant="body1" gutterBottom>
              {player?.connected ? 'yes' : 'no'}
            </Typography>
          </Grid>
          <Grid item xs={5} className={classes.label}>
            <Typography variant="body1" gutterBottom>
              token
            </Typography>
          </Grid>
          <Grid item xs={7} className={classes.value}>
            <CopyToClipboardButton text={player?.token}>Copy Token</CopyToClipboardButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
