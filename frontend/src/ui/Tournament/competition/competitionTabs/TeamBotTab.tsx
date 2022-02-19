import React from 'react';
import { makeStyles, Typography} from '@material-ui/core';
import useTeam from 'src/hooksAndQueries/useTeam';
import { useTeamPlayer } from 'src/hooksAndQueries/useTeamPlayer';
import { Tournament } from 'src/types/graphql-generated';
import CopyToClipboardButton from 'src/utils/CopyToClipboardButton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    flex: '0 0 auto',
    paddingTop: theme.spacing(3),
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      width: '50rem',
    }
  },
  mainTitle: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    marginTop: '3rem',
    marginBottom: '1rem',
  },
  sectionText: {
    marginBottom: '2rem',
  },
}));


interface TeamBotTabProps {
  tournament?: Tournament;
};

export default function TeamBotTab({ tournament }: TeamBotTabProps) {
  const classes = useStyles();

  const { team } = useTeam(tournament?.id);
  const { player } = useTeamPlayer(team?.id);
  const connectionStatus = player?.connected ? 'connected' : 'not connected';
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant='h2' className={classes.mainTitle}>
          Your team's bot
        </Typography>

        <Typography variant='h3' className={classes.sectionTitle}>
          Connection
        </Typography>

        <Typography variant='body1' className={classes.sectionText}>
          Your team's bot is {connectionStatus}.
        </Typography>
        <CopyToClipboardButton text={player?.token}>
            Copy Token
        </CopyToClipboardButton>
      </div>
    </div>
  );
}
