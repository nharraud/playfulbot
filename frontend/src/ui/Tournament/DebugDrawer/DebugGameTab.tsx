import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Game } from 'src/types/graphql-generated';
import { ControlledGame, SetGameVersion } from 'src/hooksAndQueries/useGameController';
import { Divider, Typography } from '@material-ui/core';
import GameVersionSlider from './GameVersionSlider';
import { gameDefinition } from 'playfulbot-config';
import { FrontendGameDefinition } from 'playfulbot-game-frontend';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  version: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(10),
  },
  waitMessage: {
    padding: theme.spacing(2),
  },
  versionsColumn: {
    flex: '1 1 auto'
  },
  resultColumn: {
    flex: '1 1 auto'
  },
  playerRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    flex: '0 0 auto',
    marginLeft: '1em',
  },
  playerColor: {
    flex: '0 0 auto',
    width: '2em',
    height: '2em',
    borderColor: '#000000',
    borderStyle: 'solid',
    borderWidth: '3px',
  }
}));

interface DebugGameTabProps {
  game: Game,
  createDebugGame: () => void,
  controlledGame: ControlledGame,
  setGameVersion: SetGameVersion,
  gameDefinition: FrontendGameDefinition<any>,
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
        Waiting for players to start
      </Typography>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.versionsColumn}>
        {waitMessage}
        {slider}
        <Button variant="contained" size="small" color="primary" onClick={createDebugGame}>
          Start a New Game
        </Button>
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className={classes.resultColumn}>
        <Typography variant="h6" gutterBottom>
          Game Winner(s)
        </Typography>
          {
            game?.winners?.map((playerNumber, index) => {
              if (playerNumber === null) {
                throw new Error('player number is missing');
              }
              return (<div className={classes.playerRow} key={index}>
                <div className={classes.playerColor} style={{backgroundColor: gameDefinition.playerColor(playerNumber)}}/>
                <Typography variant="body1" className={classes.playerName}>
                  Player {playerNumber}
                </Typography>
              </div>)
            })
          }
      </div>
    </div>
  );
}
