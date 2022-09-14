import React, { useCallback } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { TeamID, UserID } from 'src/types/graphql';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    textAlign: 'center',
    paddingBottom: theme.spacing(1),
    flex: '1 1 auto',
  },
  title: {},
  member: {
    textAlign: 'center',
  },
  actions: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  joinButton: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
  },
}));

interface TeamCardProps {
  team: {
    id: TeamID;
    name: string;
    members?: {
      id: UserID;
      username: string;
    }[];
  };
  onJoin: (teamID: TeamID) => void;
}

export default function TeamCard({ team, onJoin }: TeamCardProps) {
  const classes = useStyles();

  const members = team.members.map((member) => (
    <ListItem key={member.id}>
      <ListItemText className={classes.member} primary={member.username} />
    </ListItem>
  ));

  const handleJoin = useCallback(() => {
    onJoin(team.id);
  }, [team.id, onJoin]);
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {team.name}
        </Typography>
        <Typography color="textSecondary">Team Members</Typography>
        <List dense={true}>{members}</List>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          variant="contained"
          size="small"
          className={classes.joinButton}
          startIcon={<GroupAddIcon />}
          onClick={handleJoin}
        >
          Join
        </Button>
      </CardActions>
    </Card>
  );
}
