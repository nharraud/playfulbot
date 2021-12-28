import React from 'react';
import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';

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
  tabs: {
    paddingTop: theme.spacing(1),
  }
}));

interface TournamentSubPageHeaderProps {
  title: string,
  sections: Array<string>;
  currentSection: number,
  setSection: (section: number) => void
  children?: JSX.Element;
}

export function TournamentSubPageHeader(props: TournamentSubPageHeaderProps) {
  const classes = useStyles();

  const handleSectionChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    props.setSection(newValue);
  };
  const tabs = props.sections.map((sectionName, index) => <Tab label={sectionName} value={index} key={index}/>)

  return (
    <Box boxShadow={3} className={classes.root}>
      <div className={classes.mainRow}>
        <div className={classes.titleCell}>
          <Typography variant="h1">
            {props.title}
          </Typography>
        </div>
        {props.children}
      </div>
      <Tabs value={props.currentSection} onChange={handleSectionChange} aria-label='sub-sections menu' className={classes.tabs}>
        {...tabs}
      </Tabs>
    </Box>
  )
}