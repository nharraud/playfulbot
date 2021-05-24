import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';

import { UserContext } from 'src/UserContext';
import { UserMenu } from './UserMenu';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.menu.dark,
      color: theme.palette.getContrastText(theme.palette.menu.dark),
    },
    logo: {
      color: theme.palette.getContrastText(theme.palette.menu.dark),
      fontWeight: theme.typography.fontWeightBold,
      '&:hover': {
        textDecoration: 'none',
      },
    },
    pushRight: {
      marginLeft: 'auto',
    },
    link: {
      color: theme.palette.getContrastText(theme.palette.menu.dark),
      fontWeight: theme.typography.fontWeightBold,
      '&:hover': {
        textDecoration: 'none',
      },
    },
    sequenceLink: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface MenuAppBarProps {
  location?: string,
  showLogin?: boolean,
  showTournaments?: boolean,
};

export default function MenuAppBar(props: MenuAppBarProps) {
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
          <Link component={RouterLink} to={authenticated ? '/home' : '/'} className={classes.logo}>
            <Typography variant="h6">
              Playful Bot
            </Typography>
          </Link>
          {locationWidget}
          <div className={classes.pushRight}/>
          {
            authenticated && props.showTournaments &&
            <Link component={RouterLink} to='/home' className={`${classes.link} ${classes.sequenceLink}`}>Tournaments</Link>
          }
          { authenticated && (<UserMenu/>) }
          {
            !authenticated && props.showLogin &&
            (<Link component={RouterLink} to='/login' className={classes.link}>Login</Link>)
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
