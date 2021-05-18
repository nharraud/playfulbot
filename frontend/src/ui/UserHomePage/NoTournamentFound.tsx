import { makeStyles, createStyles, Theme, Typography, Paper } from '@material-ui/core';
import React from 'react';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    }
  }),
);


export function NoTournamentFound() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} variant='outlined' square={true}>
      <Typography variant='body1'>
        No Tournament Found
      </Typography>
    </Paper>
  )
}