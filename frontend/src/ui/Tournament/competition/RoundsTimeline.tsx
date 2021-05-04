
import React from 'react';
import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Tournament } from "src/types/graphql-generated";
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  paper: {}
}));

interface RoundsTimelineProps {
  tournament: Tournament | undefined;
}

export default function RoundsTimeline(props: RoundsTimelineProps) {
  const classes = useStyles();
  const { tournament: tournamentWithRounds, fetchPreviousRounds } = useTournamentRounds(props.tournament?.id);
  if (tournamentWithRounds === undefined) {
    return <div/>;
  }

  let nextRound;
  let pastRounds = [];
  if (tournamentWithRounds) {
      nextRound = tournamentWithRounds.rounds[tournamentWithRounds.rounds.length - 1];
      if (tournamentWithRounds.rounds.length > 1) {
      pastRounds = tournamentWithRounds.rounds.slice(0, tournamentWithRounds?.rounds.length - 1).reverse()
    }
  }
  
  return (
    <div className={classes.root}>
      <Timeline>

        <TimelineItem>
          <TimelineOppositeContent>
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
          <TimelineOppositeContent>
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
            <TimelineOppositeContent>
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
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  {round.status}
                </Typography>
                <Typography variant="h6" component="h1">
                  {round.teamPoints}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        )}

        <TimelineItem>
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
          <TimelineOppositeContent>
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
