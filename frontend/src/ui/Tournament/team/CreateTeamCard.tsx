import React, { useCallback } from 'react';
import { Button, Card, CardActions, CardContent, makeStyles } from '@material-ui/core';
import { TournamentID } from 'src/types/graphql';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import { TeamCreateDialog } from './TeamEditDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 1 auto',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '4rem',
  },
  actions: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
  }
}));


interface CreateTeamCardProps {
  tournamentID: TournamentID;
  onCreate: () => void;
};

export default function CreateTeamCard({ tournamentID, onCreate }: CreateTeamCardProps) {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);

  const handleClose = useCallback((team) => {
    setDialogOpen(false);
    if (team) {
      onCreate();
    }
  }, [setDialogOpen, onCreate]);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <FiberNewIcon className={classes.icon}/>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            variant="contained"
            size="small"
            className={classes.createButton}
            onClick={openDialog}
          >
            Create Team
          </Button>
        </CardActions>
      </Card>

      <TeamCreateDialog open={dialogOpen} handleClose={handleClose} tournamentID={tournamentID}/>
    </div>
  )
}