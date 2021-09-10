import React from 'react';
import { Link, makeStyles, Typography} from '@material-ui/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import dedent from 'ts-dedent';
import { CodeTypo } from 'src/utils/Typography/CodeTypo';

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    marginTop: '3rem',
    marginBottom: '1rem',
  },
  sectionText: {
    marginBottom: '2rem',
  },
}));

interface TsJsBotInstructionsProps {
  language: 'JavaScript' | 'TypeScript'
};

export function TsJsBotInstructions({ language }: TsJsBotInstructionsProps) {
  const classes = useStyles();
  const repositories: Record<typeof language, string> = {
    'TypeScript': '"git@github.com:nharraud/playfulbot-bot-ts.git"',
    'JavaScript': '"git@github.com:nharraud/playfulbot-bot-js.git"',
  }

  return (
    <>
      <Typography variant='h3' className={classes.sectionTitle}>
        Install NodeJS
      </Typography>
      <Typography variant='body1' className={classes.sectionText}>
        First <Link href='https://nodejs.org/en/download/current/' target="_blank" rel="noopener noreferrer">download and install NodeJS</Link>.
      </Typography>

      <Typography variant='h3' className={classes.sectionTitle}>
        Create a NodeJS project
      </Typography>
      <div className={classes.sectionText}>
        <Typography variant='body1' >
          Clone the example project.
        </Typography>
        <SyntaxHighlighter language="shell" style={a11yDark}>
          {dedent`
            $ git clone ${repositories[language]}
          `}
        </SyntaxHighlighter>
        <Typography variant='body1'>
          Read the instructions in the <CodeTypo>README.md</CodeTypo> file
        </Typography>

      </div>
    </>
  );
}
