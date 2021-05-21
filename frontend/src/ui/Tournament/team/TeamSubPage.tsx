import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { TournamentQuery } from 'src/types/graphql';
import useTeam from 'src/hooksAndQueries/useTeam';
import LoadingWidget from '../../Loading';
import TeamHeader from './TeamHeader';
import { TeamSections } from './TeamSections';
import { TabPanel } from 'src/utils/TabPanel';
import { TournamentRoleName } from '../../../types/graphql';
import AllTeamsTab from './AllTeamsTab';
import YourTeamTab from './YourTeamTab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


interface TeamSubPageProps {
  tournament?: TournamentQuery['tournament'];
};

export default function TeamSubPage(props: TeamSubPageProps) {
  const classes = useStyles();

  const { team, userNotPartOfAnyTeam, loading, error, refetch } = useTeam(props.tournament.id);

  const [ currentSection, setSection ] = useState(TeamSections.OTHER_TEAMS);
  const isAdmin = props.tournament.myRole === TournamentRoleName.Admin;

  const handleJoinSuccess = useCallback(() => {
    refetch();
    setSection(TeamSections.YOUR_TEAM);
  }, [setSection, refetch]);

  if (loading) {
    return <LoadingWidget/>
  } else if (error) {
    return <p>{ error.message }</p>;
  }

  return (
    <div className={classes.root}>
      <TeamHeader 
        currentSection={currentSection} setSection={setSection}
        isAdmin={isAdmin}
        invitationLinkID={props.tournament.invitationLinkID}
        loading={loading}
        hasTeam={team !== undefined}
        />
      <TabPanel value={currentSection} index={TeamSections.YOUR_TEAM}>
        <YourTeamTab tournamentID={props.tournament.id}/>
      </TabPanel>
      <TabPanel value={currentSection} index={TeamSections.OTHER_TEAMS}>
        <AllTeamsTab tournamentID={props.tournament.id} onJoinSuccess={handleJoinSuccess}/>
      </TabPanel>
    </div>
  )
}