import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { TournamentQuery } from 'src/types/graphql';
import useTeam from 'src/hooksAndQueries/useTeam';
import LoadingWidget from '../../Loading';
import TeamHeader from './TeamHeader';
import { TeamSections } from './TeamSections';
import { TabPanel } from 'src/utils/TabPanel';
import * as gqlTypes from '../../../types/graphql';

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

  const { team, userNotPartOfAnyTeam, loading, error } = useTeam(props.tournament.id);

  const [ currentSection, setSection ] = useState(TeamSections.YOUR_TEAM);
  const isAdmin = props.tournament.myRole === gqlTypes.TournamentRoleName.Admin;

  if (loading) {
    return <LoadingWidget/>
  } else if (error) {
    return <p>{ error.message }</p>;
  }

  // if (userNotPartOfAnyTeam) {
  //   return (
  //     <Button>Join team</Button>
  //   );
  // }

  return (
    <div className={classes.root}>
      <TeamHeader currentSection={currentSection} setSection={setSection} isAdmin={isAdmin} invitationID={props.tournament.mainInvitationID} />
      <TabPanel value={currentSection} index={TeamSections.YOUR_TEAM}>
        <ul>
        {team?.members?.map((member) =>
          <li>{member.username}</li>
        )}
      </ul>
      </TabPanel>
      <TabPanel value={currentSection} index={TeamSections.ALL_TEAMS}>
        Item One
      </TabPanel>
    </div>
  )
}