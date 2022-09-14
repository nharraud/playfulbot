import React, { useCallback } from 'react';
import { List, ListItem, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core';
import { TournamentID } from 'src/types/graphql';
import useTeam from 'src/hooksAndQueries/useTeam';
import EditIcon from '@material-ui/icons/Edit';
import { TeamEditDialog } from './TeamEditDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  teamContainer: {
    padding: theme.spacing(5),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  teamNameContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  teamName: {
    flex: '1 1 auto',
    paddingLeft: '2rem',
    paddingRight: '0.7rem',
  },
  editIcon: {
    flex: '0 0 auto',
    marginLeft: 'auto',
    fontSize: '1.3rem',
    color: theme.palette.grey[400],
  },
  subtitle: {
    textAlign: 'center',
  },
  membersList: {},
  memberItem: {
    textAlign: 'center',
  },
}));

interface YourTeamTabProps {
  tournamentID: TournamentID;
}

export default function YourTeamTab({ tournamentID }: YourTeamTabProps) {
  const classes = useStyles();
  const [editOpen, setEditOpen] = React.useState(false);

  const { team } = useTeam(tournamentID);

  const openDialog = useCallback(() => {
    setEditOpen(true);
  }, [setEditOpen]);

  const handleClose = useCallback(() => {
    setEditOpen(false);
  }, [setEditOpen]);

  if (!team) {
    return <div />;
  }

  const members = team.members.map((member) => (
    <ListItem key={member.id} className={classes.memberItem}>
      <ListItemText primary={member.username} />
    </ListItem>
  ));

  return (
    <div className={classes.root}>
      <Paper className={classes.teamContainer}>
        <div className={classes.teamNameContainer}>
          <Typography
            className={classes.teamName}
            variant="h5"
            onClick={() => {
              console.log('Foo');
            }}
          >
            {team.name}
          </Typography>
          <EditIcon className={classes.editIcon} onClick={openDialog} />
        </div>
        <Typography color="textSecondary" className={classes.subtitle}>
          Team Members
        </Typography>
        <List className={classes.membersList}>{members}</List>
      </Paper>
      <TeamEditDialog open={editOpen} handleClose={handleClose} team={team} />
    </div>
  );
}
