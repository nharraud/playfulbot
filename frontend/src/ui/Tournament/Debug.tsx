import React, { Suspense } from 'react';

import GameCanvas from './GameCanvas';
import DebugConfiguration from './DebugConfiguration';
import DebugBottomDrawer from './DebugDrawer/DebugDrawer';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import useDebugGame from '../../hooksAndQueries/useGame';
import { Tournament } from 'src/types/graphql';

import Button from '@material-ui/core/Button';
import { useGameController } from 'src/hooksAndQueries/useGameController';
import { gameDefinition } from 'src/games/WallRace';


const useStyles = makeStyles((theme) => ({
  box: {
    flex: "1 1 auto",
    display: 'flex',
    flexFlow: 'column',
    overflow: 'hidden'
  }
}));

interface DebugProps {
  tournament: Tournament | undefined;
}

export default function Debug(props: DebugProps) {
  const classes = useStyles();

  const { game, createDebugGame } = useDebugGame(props.tournament);
  const { controlledGame, setGameVersion } = useGameController(game);
  let content = null;
  if (game) {
    content = (
      <>
        <GameCanvas game={controlledGame} gameDefinition={gameDefinition} />
        <DebugBottomDrawer
          game={game} controlledGame={controlledGame}
          setGameVersion={setGameVersion} createDebugGame={createDebugGame}
          gameDefinition={gameDefinition} 
          />
      </>
    )
  }
  const loadingWidget = <CircularProgress />
  return (
    <Box className={classes.box} style={{overflow: 'hidden'}}>
      <Suspense fallback={loadingWidget}>
        {content}
      </Suspense>
    </Box>
  )
}