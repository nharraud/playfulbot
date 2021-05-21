import React, { useCallback, useState } from 'react';
import { Box, Button, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { TournamentInvitationLinkID } from 'src/types/graphql';
import { TeamSections } from './TeamSections';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { TeamInviteDialog } from './TeamInviteDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(3),
    backgroundColor: theme.palette.menu.main,
    color: theme.palette.getContrastText(theme.palette.menu.main),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left'
  },
  mainRow: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleCell: {
    paddingRight: theme.spacing(8),
    verticalAlign: 'bottom',
  },
  inviteButton: {
    color: theme.palette.getContrastText(theme.palette.success.main),
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  tabs: {
    paddingTop: theme.spacing(1),
  }
}));

interface TeamHeaderProps {
  hasTeam: boolean,
  loading: boolean,
  currentSection: TeamSections,
  setSection: (section: TeamSections) => void,
  isAdmin: boolean,
  invitationLinkID: TournamentInvitationLinkID | null,
}

export default function TeamHeader(props: TeamHeaderProps) {
  const classes = useStyles();

  const [ inviteModalOpen, setInviteModalOpen ] = useState(false);
  const closeInviteModal = useCallback(() => setInviteModalOpen(false), []);
  const openInviteModal = useCallback(() => setInviteModalOpen(true), []);

  const handleSectionChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    props.setSection(newValue);
  };


  let inviteComp;
  if (props.isAdmin) {
    inviteComp = (
      <>
        <Button variant='contained' className={classes.inviteButton} color="secondary"
            startIcon={<PersonAddIcon/>} onClick={openInviteModal}
        >
          Invite Players
        </Button>
        <TeamInviteDialog open={inviteModalOpen} handleClose={closeInviteModal} invitationLinkID={props.invitationLinkID}/>
      </>
    )
  }

  let yourTeamTab;
  let otherTeamTab;
  if (!props.loading) {
    if (props.hasTeam) {
      yourTeamTab = <Tab label="Your Team" value={TeamSections.YOUR_TEAM}/>;
      otherTeamTab = <Tab label="Other Teams" value={TeamSections.OTHER_TEAMS}/>;
    } else {
      yourTeamTab = undefined;
      otherTeamTab = <Tab label="All Teams" value={TeamSections.OTHER_TEAMS}/>;
    }
  } else {
    yourTeamTab = undefined;
    otherTeamTab = undefined;
  }

  return (
    <Box boxShadow={3} className={classes.root}>
      <div className={classes.mainRow}>
        <div className={classes.titleCell}>
          <Typography variant="h4">
            Teams
          </Typography>
        </div>
        {inviteComp}
      </div>
      <Tabs value={props.currentSection} onChange={handleSectionChange} aria-label="Team sections" className={classes.tabs}>
        {otherTeamTab}
        {yourTeamTab}
      </Tabs>
    </Box>
  )
}