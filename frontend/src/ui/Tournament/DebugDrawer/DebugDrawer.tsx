import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { Game } from 'src/types/graphql-generated';
import { SetGameVersion, ControlledGame } from 'src/hooksAndQueries/useGameController';
import { GameDefinition } from 'src/games/GameDefinition';
import DebugGameTab from './DebugGameTab';
import DebugPlayersTab from './DebugPlayersTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: '15em' }}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

interface DebugDrawerProps {
  game: Game;
  controlledGame: ControlledGame;
  setGameVersion: SetGameVersion;
  createDebugGame: () => void;
  gameDefinition: GameDefinition;
}

export default function DebugDrawer(props: DebugDrawerProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} aria-label="Game tabs">
          <Tab label="Game" {...a11yProps(0)} />
          <Tab label="Players" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <DebugGameTab
          createDebugGame={props.createDebugGame}
          setGameVersion={props.setGameVersion}
          controlledGame={props.controlledGame}
          game={props.game}
          gameDefinition={props.gameDefinition}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DebugPlayersTab game={props.game} />
      </TabPanel>
    </div>
  );
}
