import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { SupportedProgrammingLanguages } from 'src/types/programmingLanguages';
import { TsJsBotInstructions } from './languageSpecificInstructions/TsJsBotInstructions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    flex: '0 0 auto',
    paddingTop: theme.spacing(3),
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      width: '50rem',
    },
  },
  mainTitle: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    marginTop: '3rem',
    marginBottom: '1rem',
  },
  sectionText: {
    marginBottom: '2rem',
  },
  languageFormControl: {
    width: '20em',
  },
}));

interface CodingBotInfoTabProps {
  // tournament?: {
  //   name?: string,
  // }
}

export function CodingBotInfoTab(props: CodingBotInfoTabProps) {
  const classes = useStyles();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    SupportedProgrammingLanguages.TypeScript.toString()
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const languageSpecificInstructions: Record<SupportedProgrammingLanguages, JSX.Element> = {
    TypeScript: <TsJsBotInstructions language="TypeScript" />,
    JavaScript: <TsJsBotInstructions language="JavaScript" />,
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h2" className={classes.mainTitle}>
          How to code a bot and make it play
        </Typography>

        <Typography variant="h3" className={classes.sectionTitle}>
          Choose a programming language
        </Typography>

        <Typography variant="body1" className={classes.sectionText}>
          First you have to choose the programming language you want to program your bot in.
        </Typography>
        <FormControl variant="outlined" className={classes.languageFormControl}>
          <InputLabel id="choose-language-select-label">Programming Language</InputLabel>
          <Select
            labelId="choose-language-select-label"
            id="choose-language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            label="Programming Language"
          >
            {Object.keys(SupportedProgrammingLanguages).map((lang) => (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {languageSpecificInstructions[selectedLanguage]}
      </div>
    </div>
  );
}
