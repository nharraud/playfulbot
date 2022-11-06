import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Round, Tournament } from 'src/types/graphql-generated';
import useTournamentRounds from 'src/hooksAndQueries/useTournamentRounds';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimerIcon from '@mui/icons-material/Timer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MemoryIcon from '@mui/icons-material/Memory';
import { DateTime } from 'luxon';
import { Link, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  title: {
    textAlign: 'left',
    marginLeft: theme.spacing(12),
    marginBottom: theme.spacing(7),
    marginTop: theme.spacing(2),
  },
  paper: {},
  oppositeContent: {
    flex: 0.05,
  },
  link: {
    textDecoration: 'inherit',
    color: 'inherit',
  },
}));

interface RoundsTimelineProps {
  tournament: Tournament | undefined;
}

export default function RoundsTimeline(props: RoundsTimelineProps) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { tournament: tournamentWithRounds, fetchPreviousRounds } = useTournamentRounds(
    props.tournament?.id
  );
  if (tournamentWithRounds === undefined) {
    return <div />;
  }

  let nextRound: Round;
  let pastRounds: Round[] = [];
  if (tournamentWithRounds) {
    nextRound = tournamentWithRounds.rounds[tournamentWithRounds.rounds.length - 1];
    if (tournamentWithRounds.rounds.length > 1) {
      pastRounds = tournamentWithRounds.rounds
        .slice(0, tournamentWithRounds?.rounds.length - 1)
        .reverse();
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Tournament's rounds
      </Typography>
      <Timeline>
        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="body2" color="textSecondary">
              {DateTime.fromISO(tournamentWithRounds.lastRoundDate).toLocaleString(
                DateTime.TIME_SIMPLE
              )}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <TimerIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                Last Round
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}></TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="grey" variant="outlined">
              <MoreVertIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                X more rounds (every {tournamentWithRounds.minutesBetweenRounds} minutes)
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="body2" color="textSecondary">
              {DateTime.fromISO(nextRound.startDate).toLocaleString(DateTime.TIME_SIMPLE)}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="grey" variant="outlined">
              <MemoryIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                'Next round'
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        {pastRounds.map((round, index) => (
          <TimelineItem key={round.id}>
            <TimelineOppositeContent className={classes.oppositeContent}>
              <Typography variant="body2" color="textSecondary">
                {DateTime.fromISO(round.startDate).toLocaleString(DateTime.TIME_SIMPLE)}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="grey" variant="outlined">
                <MemoryIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Link to={`${match.url}/rounds/${round.id}`}>
                <Paper elevation={3} className={classes.paper}>
                  <Typography variant="h6" component="h1">
                    {round.status}
                  </Typography>
                  <Typography variant="h6" component="h1">
                    {round.teamPoints}
                  </Typography>
                </Paper>
              </Link>
            </TimelineContent>
          </TimelineItem>
        ))}

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}></TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="grey" variant="outlined">
              <MoreVertIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                Y more rounds
              </Typography>
              <Button variant="contained" color="primary" onClick={fetchPreviousRounds}>
                Expand
              </Button>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="body2" color="textSecondary">
              {DateTime.fromISO(tournamentWithRounds.startDate).toLocaleString(
                DateTime.TIME_SIMPLE
              )}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <TimerIcon />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                Tournament Start
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
