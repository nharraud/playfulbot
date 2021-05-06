
import React from 'react';
import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Round, Tournament } from "src/types/graphql-generated";
import useTournamentRounds from 'src/hooksAndQueries/useTournamentRounds';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimerIcon from '@material-ui/icons/Timer';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MemoryIcon from '@material-ui/icons/Memory';
import { DateTime } from 'luxon';
import {
  Link,
  useRouteMatch
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  title: {
    textAlign: "left",
    marginLeft: theme.spacing(12),
    marginBottom: theme.spacing(7),
    marginTop: theme.spacing(2),
  },
  paper: {},
  oppositeContent: {
    flex: 0.05
  },
  link: {
    textDecoration: "inherit",
    color: "inherit",
  }
}));

interface RoundsTimelineProps {
  tournament: Tournament | undefined;
}

export default function RoundsTimeline(props: RoundsTimelineProps) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { tournament: tournamentWithRounds, fetchPreviousRounds } = useTournamentRounds(props.tournament?.id);
  if (tournamentWithRounds === undefined) {
    return <div/>;
  }

  let nextRound: Round;
  let pastRounds: Round[] = [];
  if (tournamentWithRounds) {
      nextRound = tournamentWithRounds.rounds[tournamentWithRounds.rounds.length - 1];
      if (tournamentWithRounds.rounds.length > 1) {
      pastRounds = tournamentWithRounds.rounds.slice(0, tournamentWithRounds?.rounds.length - 1).reverse()
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
              { DateTime.fromISO(tournamentWithRounds.lastRoundDate).toLocaleString(DateTime.TIME_SIMPLE) }
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color='primary'>
              <TimerIcon/>
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
          <TimelineOppositeContent className={classes.oppositeContent}>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color='grey' variant='outlined'>
              <MoreVertIcon/>
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
              { DateTime.fromISO(nextRound.startDate).toLocaleString(DateTime.TIME_SIMPLE) }
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color='grey' variant='outlined'>
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

        {pastRounds.map((round, index) =>
          <TimelineItem key={round.id}>
            <TimelineOppositeContent className={classes.oppositeContent}>
              <Typography variant="body2" color="textSecondary">
                { DateTime.fromISO(round.startDate).toLocaleString(DateTime.TIME_SIMPLE) }
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color='grey' variant='outlined'>
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
        )}

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color='grey' variant='outlined'>
              <MoreVertIcon/>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                Y more rounds
              </Typography>
              <Button variant='contained' color='primary' onClick={fetchPreviousRounds}>
                Expand
              </Button>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent className={classes.oppositeContent}>
            <Typography variant="body2" color="textSecondary">
              { DateTime.fromISO(tournamentWithRounds.startDate).toLocaleString(DateTime.TIME_SIMPLE) }
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color='primary'>
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
  )
}
