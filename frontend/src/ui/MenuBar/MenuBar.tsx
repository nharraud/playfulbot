import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';

import { UserContext } from 'src/UserContext';
import { UserMenu } from './UserMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);


export default function MenuAppBar(props: { location?: string}) {
  const classes = useStyles();
  const { authenticated } = useContext(UserContext);

  let locationWidget = undefined;
  if (props.location) {
    locationWidget = (
      <>
      <ArrowForwardIosRoundedIcon fontSize="small" color="secondary" />
      <Typography variant="h6">
        { props.location }
      </Typography>
      </>
    )
  }

  return (
    <div className={classes.root}>
      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar variant="dense">
          <Typography variant="h6">
            Playful Bot
          </Typography>
          {locationWidget}
          {authenticated && (<UserMenu/>)}
        </Toolbar>
      </AppBar>
    </div>
  );
}
