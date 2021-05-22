import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { TournamentQuery } from 'src/types/graphql-generated';
import { TabPanel } from 'src/utils/TabPanel';
import { InfoHeader } from './InfoHeader';
import { InfoSections} from './InfoSections';
import IntroTab from './IntroTab';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


interface TournamentInfoProps {
  tournament?: TournamentQuery['tournament'];
};

export default function InfoSubPage(props: TournamentInfoProps) {
  const classes = useStyles();

  const [ currentSection, setSection ] = useState(InfoSections.INTRO);

  return (
    <div className={classes.root}>
      <InfoHeader currentSection={currentSection} setSection={setSection}/>
      <TabPanel value={currentSection} index={InfoSections.INTRO}>
        <IntroTab tournamentID={props.tournament.id}/>
      </TabPanel>
    </div>
  )
}