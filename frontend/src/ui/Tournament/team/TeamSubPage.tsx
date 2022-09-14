import React, { useCallback, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { TournamentQuery } from 'src/types/graphql';
import useTeam from 'src/hooksAndQueries/useTeam';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LoadingWidget from '../../Loading';
import { TournamentRoleName } from '../../../types/graphql';
import AllTeamsTab from './AllTeamsTab';
import YourTeamTab from './YourTeamTab';
import TournamentSubPage from '../components/TournamentSubPage';
import { TeamInviteDialog } from './TeamInviteDialog';

const useStyles = makeStyles((theme) => ({
  inviteButton: {
    color: theme.palette.getContrastText(theme.palette.success.main),
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

interface TeamSubPageProps {
  tournament?: TournamentQuery['tournament'];
}

export default function TeamSubPage(props: TeamSubPageProps) {
  const classes = useStyles();
  const [currentSection, setSection] = useState(0);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const closeInviteModal = useCallback(() => setInviteModalOpen(false), []);
  const openInviteModal = useCallback(() => setInviteModalOpen(true), []);

  const { team, userNotPartOfAnyTeam, loading, error, refetch } = useTeam(props.tournament.id);

  const isAdmin = props.tournament.myRole === TournamentRoleName.Admin;

  const handleJoinSuccess = useCallback(() => {
    refetch();
    setSection(0);
  }, [setSection, refetch]);

  if (loading) {
    return <LoadingWidget />;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  let inviteComp;
  if (isAdmin) {
    inviteComp = (
      <>
        <Button
          variant="contained"
          className={classes.inviteButton}
          color="secondary"
          startIcon={<PersonAddIcon />}
          onClick={openInviteModal}
        >
          Invite Players
        </Button>
        <TeamInviteDialog
          open={inviteModalOpen}
          handleClose={closeInviteModal}
          invitationLinkID={props.tournament.invitationLinkID}
        />
      </>
    );
  }

  let sections: [string, JSX.Element][] = [];
  if (!loading) {
    const hasTeam = team !== undefined;
    if (hasTeam) {
      sections = [
        ['Your Team', <YourTeamTab tournamentID={props.tournament.id} />],
        [
          'Other Teams',
          <AllTeamsTab tournamentID={props.tournament.id} onJoinSuccess={handleJoinSuccess} />,
        ],
      ] as [string, JSX.Element][];
    } else {
      sections = [
        [
          'All Teams',
          <AllTeamsTab tournamentID={props.tournament.id} onJoinSuccess={handleJoinSuccess} />,
        ],
      ] as [string, JSX.Element][];
    }
  }

  return (
    <TournamentSubPage
      title="Teams"
      sections={sections}
      currentSection={currentSection}
      setSection={setSection}
    >
      {inviteComp}
    </TournamentSubPage>
  );
}
