import React, { Suspense } from 'react';

import DebugBottomDrawer from './DebugDrawer/DebugDrawer';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import useDebugGame from '../../hooksAndQueries/useGame';
import { Tournament } from 'src/types/graphql';

import { useGameController } from 'src/hooksAndQueries/useGameController';
import { gameDefinition } from 'playfulbot-config';


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
  if (game && controlledGame) {
    content = (
      <>
        <gameDefinition.game gameState={controlledGame.gameState}/>
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