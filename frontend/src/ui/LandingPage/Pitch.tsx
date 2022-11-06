import React from 'react';
import { Theme, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import gameImage from '../../assets/images/game.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    pitchRow: {
      flex: '1 1 auto',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'row',
    },
    arrowRow: {
      flex: '0 0 auto',
    },
    imgContainer: {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    pitchContainer: {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    gameImg: {
      maxWidth: '100%',
      maxHeight: '100%',
      padding: theme.spacing(2),
    },
    pitch: {
      maxWidth: '20em',
    },
    arrow: {
      fontSize: 30,
    },
  })
);

export function Pitch() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.pitchRow}>
        <div className={classes.imgContainer}>
          <img src={gameImage} className={classes.gameImg} alt="Game screenshot" />
        </div>
        <div className={classes.pitchContainer}>
          <Typography variant="h3" className={classes.pitch}>
            Organize Fun, Short and Intense Coding Competitions.
          </Typography>
        </div>
      </div>
      <div className={classes.arrowRow}>
        <ArrowDownwardRoundedIcon className={classes.arrow} />
      </div>
    </div>
  );
}
