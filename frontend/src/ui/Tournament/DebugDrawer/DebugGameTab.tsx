import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Game } from 'src/types/graphql-generated';
import { ControlledGame, SetGameVersion } from 'src/hooksAndQueries/useGameController';
import { Slider, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  version: {
    paddingBottom: theme.spacing(3),
  },
  versionSlider: {},
  waitMessage: {
    padding: theme.spacing(2),
  }
}));

interface DevbugGameTabProps {
  game: Game,
  createDebugGame: () => void,
  controlledGame: ControlledGame,
  setGameVersion: SetGameVersion,
}

export default function DebugGameTab({ game, createDebugGame, controlledGame, setGameVersion}: DevbugGameTabProps) {
  const classes = useStyles();

  const [slidingVersion, setSlidingVersion] = useState<number>(undefined);

  const onSlidingVersionCommit = useCallback((event, version) => {
    setGameVersion(version);
  }, [setGameVersion]);

  const onSlidingVersionChange = useCallback((event, version) => {
    setSlidingVersion(version);
  }, [setSlidingVersion]);

  useEffect(() => {
    if (controlledGame !== undefined && slidingVersion === undefined) {
      setSlidingVersion(controlledGame.version);
    }
  }, [controlledGame, slidingVersion, setSlidingVersion])

  let slider;
  let waitMessage;
  if (game !== undefined && game.version !== 0) {
    slider = (
      <div className={classes.version} >
        <Typography id='game-version-slider-title' variant="h6" gutterBottom>
          Game Versions
        </Typography>
        <Slider className={classes.versionSlider}
          value={slidingVersion === undefined ? 0 : slidingVersion}
          onChangeCommitted={onSlidingVersionCommit}
          onChange={onSlidingVersionChange}
          aria-labelledby="game-version-slider-title"
          step={1}
          marks
          min={0}
          max={game.version || 0}
          color="secondary"
          valueLabelDisplay={ "on" }
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

// export default DebugGameTab;