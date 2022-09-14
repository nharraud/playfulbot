import React, { Suspense } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { Tournament } from 'src/types/graphql';

import { useGameController } from 'src/hooksAndQueries/useGameController';
import { gameDefinition } from 'playfulbot-config';
import useDebugGame from '../../hooksAndQueries/useGame';
import DebugBottomDrawer from './DebugDrawer/DebugDrawer';

const useStyles = makeStyles((theme) => ({
  box: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'column',
    overflow: 'hidden',
  },
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
        <Box style={{ flex: '1 1 0', overflow: 'hidden' }}>
          <gameDefinition.game gameState={controlledGame.gameState} />
        </Box>
        <DebugBottomDrawer
          game={game}
          controlledGame={controlledGame}
          setGameVersion={setGameVersion}
          createDebugGame={createDebugGame}
          gameDefinition={gameDefinition}
        />
      </>
    );
  }
  const loadingWidget = <CircularProgress />;
  return (
    <Box className={classes.box} style={{ overflow: 'hidden' }}>
      <Suspense fallback={loadingWidget}>{content}</Suspense>
    </Box>
  );
}
