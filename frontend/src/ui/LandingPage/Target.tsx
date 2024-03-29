import React from 'react';
import { Theme, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { TimedCodingIcon } from '../icons/TimedCodingIcon';
import { DeploymentIcon } from '../icons/DeploymentIcon';
import { GameBotIcon } from '../icons/GameBotIcon';
import { TeamBuildingIcon } from '../icons/TeamBuildingIcon';
import { NoMoneyIcon } from '../icons/NoMoneyIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      height: '100vh',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    icon: {
      fontSize: '7em',
      color: 'white',
    },
    descriptionContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: theme.spacing(5),
    },
  })
);

export function Target() {
  const classes = useStyles();

  // FIXME: add author citation for every icon
  const advantages = [
    {
      icon: <GameBotIcon className={classes.icon} />,
      text: 'Program bots and make them play games against each other',
    },
    {
      icon: <TeamBuildingIcon className={classes.icon} />,
      text: 'Work in team to find the best strategies',
    },
    {
      icon: <TimedCodingIcon className={classes.icon} />,
      text: 'Ideal for short events such as team building, courses, etc...',
    },
    {
      icon: <DeploymentIcon className={classes.icon} />,
      text: 'Easy to deploy on a single server',
    },
    {
      icon: <NoMoneyIcon className={classes.icon} />,
      text: 'Completely Free',
    },
  ];

  return (
    <div className={classes.root}>
      {advantages.map((advantage) => (
        <Grid key={advantage.text} container>
          <Grid item xs={2} className={classes.iconContainer}>
            {advantage.icon}
          </Grid>
          <Grid item xs={10} className={classes.descriptionContainer}>
            <Typography variant="h4">{advantage.text}</Typography>
          </Grid>
        </Grid>
      ))}
    </div>
  );
}
