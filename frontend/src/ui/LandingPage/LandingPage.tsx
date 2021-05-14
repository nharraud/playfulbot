import { makeStyles, createStyles, Theme } from '@material-ui/core';
import React from 'react';
import MenuBar from '../MenuBar/MenuBar';
import { Pitch } from './Pitch';
import { Target } from './Target';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    introRow: {
      flex: '1 1 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export function LandingPage() {
  const classes = useStyles();

  return (
  <div className={classes.root}>
    <div className={classes.introRow}>
      <MenuBar />
      <Pitch/>
    </div>
    <Target/>
  </div>
  )
}