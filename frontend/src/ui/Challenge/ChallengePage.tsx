import React from 'react';
import { useContext } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from 'react-router-dom';


import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
// import ListItemLink from '@material-ui/core/ListItem';
import ListItemLink from '../../utils/ListItemLink';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Debug from './Debug';
import Info from './Info';
import CodingIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';
import CompetitionIcon from '@material-ui/icons/EmojiEvents';
import TestIcon from '@material-ui/icons/SlowMotionVideo';
import BugIcon from '@material-ui/icons/BugReport';


const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1 1 auto'
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  content: {
    display: 'flex',
    flex: "1 1 auto",
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
}));


export default function ChallengePage() {
  let match = useRouteMatch();

  const classes = useStyles();
  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.appBarSpacer}></div>
        <List>
            <ListItemLink button key={'Info'} to={`${match.url}/info`}>
                <ListItemIcon><InfoIcon fontSize="large"/></ListItemIcon>
                <ListItemText primary={'Info'} />
            </ListItemLink>
            <ListItemLink button key={'Coding'} to={`${match.url}/code`}>
              <ListItemIcon><CodingIcon fontSize="large"/></ListItemIcon>
              <ListItemText primary={'Coding'} />
            </ListItemLink> 
            <ListItemLink button key={'Debug'} to={`${match.url}/debug`}>
              <ListItemIcon><BugIcon fontSize="large"/></ListItemIcon>
              <ListItemText primary={'Debug'} />
            </ListItemLink> 
            <ListItemLink button key={'Test'} to={`${match.url}/test`}>
              <ListItemIcon><TestIcon fontSize="large"/></ListItemIcon>
              <ListItemText primary={'Test'} />
            </ListItemLink> 
            <ListItemLink button key={'Competition'} to={`${match.url}/compete`}>
              <ListItemIcon><CompetitionIcon fontSize="large"/></ListItemIcon>
              <ListItemText primary={'Competition'} />
            </ListItemLink> 
        </List>
      </Drawer>
      <main
        className={classes.content}
      >
        <Switch>
          <Route path={`${match.url}/info`}>
            <Info/>
          </Route>
          <Route path={`${match.url}/debug`}>
            <Debug/>
          </Route>
        </Switch>
      </main>
    </div>
  )
}