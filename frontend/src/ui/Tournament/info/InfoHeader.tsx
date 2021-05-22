import React from 'react';
import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { InfoSections } from './InfoSections';

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

interface InfoHeaderProps {
  currentSection: InfoSections,
  setSection: (section: InfoSections) => void
}

export function InfoHeader(props: InfoHeaderProps) {
  const classes = useStyles();

  const handleSectionChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    props.setSection(newValue);
  };

  return (
    <Box boxShadow={3} className={classes.root}>
      <div className={classes.mainRow}>
        <div className={classes.titleCell}>
          <Typography variant="h1">
            Information {'\u0026'} Rules
          </Typography>
        </div>
      </div>
      <Tabs value={props.currentSection} onChange={handleSectionChange} aria-label="Information sections" className={classes.tabs}>
      <Tab label="Tournament" value={InfoSections.TOURNAMENT}/>;
      <Tab label="Game rules" value={InfoSections.GAME_RULES}/>;
      <Tab label="Coding a bot" value={InfoSections.CODING_BOT}/>;
      </Tabs>
    </Box>
  )
}