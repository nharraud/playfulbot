import React, { Suspense } from 'react';

import GameCanvas from './GameCanvas';
import DebugConfiguration from './DebugConfiguration';
import DebugBottomDrawer from './DebugDrawer/DebugDrawer';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import useDebugGame from '../../useGame';


import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  box: {
    flex: "1 1 auto",
    display: 'flex',
    flexFlow: 'column',
    overflow: 'hidden'
  }
}));

export default function Debug() {
  const classes = useStyles();

  const { playAction, createDebugGame, loading, error, data } = useDebugGame();
  const gameProps = { playAction, data };
  const ref = React.createRef();
  let content = null;
  if (!loading && !error) {
    content = (
      <>
        <GameCanvas game={gameProps}/>
        <DebugBottomDrawer createDebugGame={createDebugGame} game={gameProps}/>
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