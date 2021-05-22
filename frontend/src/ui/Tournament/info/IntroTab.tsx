import React from 'react';
import { makeStyles, Typography} from '@material-ui/core';
import { TournamentID } from 'src/types/graphql';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
  }
}));


interface IntroTabProps {
  tournamentID: TournamentID;
};

export default function IntroTab({ tournamentID }: IntroTabProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant='h2'>
        Introduction to this tournament
      </Typography>
    </div>
  );
}
