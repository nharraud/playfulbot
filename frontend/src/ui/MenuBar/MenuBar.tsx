import React, { useContext } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import { UserContext } from 'src/UserContext';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { UserMenu } from './UserMenu';

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
        color: theme.palette.success.light,
      },
    },
    sequenceLink: {
      marginRight: theme.spacing(2),
    },
  })
);

interface MenuAppBarProps {
  location?: string;
  showLogin?: boolean;
  showTournaments?: boolean;
}

export default function MenuAppBar(props: MenuAppBarProps) {
  const classes = useStyles();
  const { authenticated } = useContext(UserContext);

  let locationWidget;
  if (props.location) {
    locationWidget = (
      <>
        <ArrowForwardIosRoundedIcon fontSize="small" color="secondary" />
        <Typography variant="h6">{props.location}</Typography>
      </>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar variant="dense">
          <Link component={RouterLink} to={authenticated ? '/home' : '/'} className={classes.logo}>
            <Typography variant="h6">Playful Bot</Typography>
          </Link>
          {locationWidget}
          <div className={classes.pushRight} />
          {authenticated && props.showTournaments && (
            <Link
              component={RouterLink}
              to="/home"
              className={`${classes.link} ${classes.sequenceLink}`}
            >
              Your Tournaments
            </Link>
          )}
          {authenticated && <UserMenu />}
          {!authenticated && props.showLogin && (
            <Link component={RouterLink} to="/login" className={classes.link}>
              Login
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
