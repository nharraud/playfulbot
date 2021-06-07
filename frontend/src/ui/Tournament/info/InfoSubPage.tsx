import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { TournamentQuery } from 'src/types/graphql-generated';
import { TabPanel } from 'src/utils/TabPanel';
import { CodingBotInfoTab } from './infoTabs/CodingBotInfoTab';
import { InfoHeader } from './InfoHeader';
import { InfoSections} from './InfoSections';
import IntroTab from './infoTabs/TournamentInfoTab';


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

  const [ currentSection, setSection ] = useState(InfoSections.TOURNAMENT);

  return (
    <div className={classes.root}>
      <InfoHeader currentSection={currentSection} setSection={setSection}/>
      <TabPanel value={currentSection} index={InfoSections.TOURNAMENT}>
        <IntroTab tournament={props.tournament}/>
      </TabPanel>
      <TabPanel value={currentSection} index={InfoSections.GAME_RULES}>
      </TabPanel>
      <TabPanel value={currentSection} index={InfoSections.CODING_BOT}>
        <CodingBotInfoTab/>
      </TabPanel>
    </div>
  )
}