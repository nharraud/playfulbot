import { Theme, Typography, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
  })
);

export function NoTournamentFound() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} variant="outlined" square={true}>
      <Typography variant="body1">No Tournament Found</Typography>
    </Paper>
  );
}
