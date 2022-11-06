import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PeopleIcon from '@mui/icons-material/People';
import { DateTime } from 'luxon';

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
    },
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
  textIcon: {
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    verticalAlign: 'text-bottom',
  },
}));

interface TournamentInfoTabProps {
  tournament?: {
    name?: string;
    startDate?: any;
    firstRoundDate?: any;
    lastRoundDate?: any;
    roundsNumber?: number;
    minutesBetweenRounds?: number;
  };
}

export default function TournamentInfoTab({ tournament }: TournamentInfoTabProps) {
  const classes = useStyles();

  const startDate = tournament ? DateTime.fromISO(tournament.startDate) : undefined;
  const firstRoundDate = tournament ? DateTime.fromISO(tournament.firstRoundDate) : undefined;
  const lastRoundDate = tournament ? DateTime.fromISO(tournament.lastRoundDate) : undefined;
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h2" className={classes.mainTitle}>
          Welcome to the "{tournament?.name}" tournament!
        </Typography>

        <Typography variant="h3" className={classes.sectionTitle}>
          What it is
        </Typography>

        <Typography variant="body1" className={classes.sectionText}>
          This is a team-based competition during which you will program bots. Each bot will connect
          to an online arena and play games against other teams' bots.
        </Typography>

        <Typography variant="h3" className={classes.sectionTitle}>
          How to win
        </Typography>

        <Typography variant="body1" className={classes.sectionText}>
          The tournament has multiple "rounds". During each round a game will be organized between
          each pair of bot. Your team gets 1 point for each game your bot wins, the losing team gets
          of 0 point. The team with the most points at the end of the last round wins the
          tournament.
        </Typography>

        <Typography variant="h3" className={classes.sectionTitle}>
          Schedule
        </Typography>

        <Typography variant="body1" className={classes.sectionText}>
          <ul>
            <li>Tournament starts: {startDate?.toLocaleString(DateTime.DATETIME_FULL)}.</li>
            <li>First round starts: {firstRoundDate?.toLocaleString(DateTime.DATETIME_FULL)}.</li>
            <li>Then one round starts every: {tournament.minutesBetweenRounds} minutes.</li>
            <li>Last round starts: {lastRoundDate?.toLocaleString(DateTime.DATETIME_FULL)}.</li>
            <li>Total number of rounds: {tournament.roundsNumber}.</li>
          </ul>
        </Typography>

        <Typography variant="h3" className={classes.sectionTitle}>
          Where to start
        </Typography>

        <Typography variant="body1" className={classes.sectionText}>
          First you need to create or join a team. Click on the
          <PeopleIcon className={classes.textIcon} titleAccess="team button" role="img" />
          in the left menu to go to the "teams" page. Then you and your teammates can go to the
          "game rules" tab on this page and learn how to play a game. Information on how to program
          a bots are also available on this page in the tab "Coding a bot".
        </Typography>
      </div>
    </div>
  );
}
