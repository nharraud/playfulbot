import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Game } from 'src/types/graphql-generated';
import { ControlledGame, SetGameVersion } from 'src/hooksAndQueries/useGameController';
import { Typography } from '@material-ui/core';
import GameVersionSlider from './GameVersionSlider';

const useStyles = makeStyles((theme) => ({
  root: {},
  version: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(10),
  },
  waitMessage: {
    padding: theme.spacing(2),
  }
}));

interface DebugGameTabProps {
  game: Game,
  createDebugGame: () => void,
  controlledGame: ControlledGame,
  setGameVersion: SetGameVersion,
}

export default function DebugGameTab({ game, createDebugGame, controlledGame, setGameVersion}: DebugGameTabProps) {
  const classes = useStyles();

  let slider;
  let waitMessage;
  if (game !== undefined && game.version !== 0) {
    slider = (
      <div className={classes.version} >
        <Typography id='game-version-slider-title' variant="h6" gutterBottom>
          Game Turns
        </Typography>
        <GameVersionSlider
          controlledGame={controlledGame}
          setGameVersion={setGameVersion}
        />
      </div>
    )
  } else {
    waitMessage = (
      <Typography className={classes.waitMessage} variant="h6" gutterBottom>
        Waiting for players to play
      </Typography>
    )
  }

  return (
    <div className={classes.root}>
      {waitMessage}
      {slider}
      <Button variant="contained" size="small" color="primary" onClick={createDebugGame}>
        Start a New Game
      </Button>
    </div>
  );
}
