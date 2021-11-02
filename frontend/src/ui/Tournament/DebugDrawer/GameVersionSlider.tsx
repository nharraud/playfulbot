import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ControlledGame, SetGameVersion } from 'src/hooksAndQueries/useGameController';
import { Slider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  versionSlider: {}
}));

interface GameVersionSliderProps {
  controlledGame: ControlledGame,
  setGameVersion: SetGameVersion,
}

export default function GameVersionSlider({ controlledGame, setGameVersion}: GameVersionSliderProps) {
  const classes = useStyles();

  const [slidingVersion, setSlidingVersion] = useState<number>(undefined);
  const [changingVersion, setChangingVersion] = useState<boolean>(false);
  const [maxVersion, setMaxVersion] = useState<number>(0);

  const onSlidingVersionCommit = useCallback((event, version) => {
    setChangingVersion(false);
    setGameVersion(version);
  }, [setGameVersion]);

  const onSlidingVersionChange = useCallback((event, version) => {
    setChangingVersion(true);
    setSlidingVersion(version);
  }, [setSlidingVersion]);

  useEffect(() => {
    if (controlledGame !== undefined && slidingVersion !== controlledGame.version && !changingVersion) {
      setSlidingVersion(controlledGame.version);
    }
    if (controlledGame !== undefined && maxVersion !== controlledGame.maxVersion) {
      setMaxVersion(controlledGame.maxVersion)
    }
  }, [
    controlledGame, controlledGame?.version,
    slidingVersion, changingVersion, setSlidingVersion,
    maxVersion, setMaxVersion
  ])

  const marks = [
    {
      value: 0,
      label: '0',
    },
  ];
  if (maxVersion) {
    marks.push({
      value: maxVersion,
      label: (maxVersion).toString(),
    });
  }

  return (
    <Slider className={classes.versionSlider}
      value={slidingVersion === undefined ? 0 : slidingVersion}
      onChangeCommitted={onSlidingVersionCommit}
      onChange={onSlidingVersionChange}
      aria-labelledby="game-version-slider-title"
      step={1}
      marks={marks}
      min={0}
      max={maxVersion}
      color="secondary"
      valueLabelDisplay={ "on" }
    />
  )
}