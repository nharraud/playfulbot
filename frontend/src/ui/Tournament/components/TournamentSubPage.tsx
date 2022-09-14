import { makeStyles } from '@material-ui/core';
import React from 'react';
import { TabPanel } from 'src/utils/TabPanel';
import { TournamentSubPageHeader } from './TournamentSubPageHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

interface TournamentSubPageProps {
  title: string;
  sections: Array<[string, JSX.Element]>;
  currentSection: number;
  setSection: React.Dispatch<React.SetStateAction<number>>;
  children?: JSX.Element;
}

export default function TournamentSubPage(props: TournamentSubPageProps) {
  const classes = useStyles();
  const sectionNames = props.sections.map((section) => section[0]);

  const tabPanels = props.sections.map((section, index) => (
    <TabPanel value={props.currentSection} index={index} key={index}>
      {section[1]}
    </TabPanel>
  ));

  return (
    <div className={classes.root}>
      <TournamentSubPageHeader
        title={props.title}
        sections={sectionNames}
        currentSection={props.currentSection}
        setSection={props.setSection}
      >
        {props.children}
      </TournamentSubPageHeader>
      {...tabPanels}
    </div>
  );
}
