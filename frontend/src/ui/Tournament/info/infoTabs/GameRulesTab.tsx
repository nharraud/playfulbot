import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { gameDefinition } from 'playfulbot-config';
import { StringChildrenProps } from 'playfulbot-game-frontend';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import dedent from 'ts-dedent';

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
}));

function SectionTitle({ children }: StringChildrenProps) {
  const classes = useStyles();
  return (
    <Typography variant="h3" className={classes.sectionTitle}>
      {children}
    </Typography>
  );
}

function SectionParagraph({ children }: StringChildrenProps) {
  return <Typography variant="body1">{children}</Typography>;
}

function CodeBlock({ children }: StringChildrenProps) {
  return <SyntaxHighlighter style={a11yDark}>{dedent(children)}</SyntaxHighlighter>;
}

interface GameRulesTabProps {}

export function GameRulesTab(props: GameRulesTabProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h2" className={classes.mainTitle}>
          Game Rules
        </Typography>

        <gameDefinition.rules
          SectionTitle={SectionTitle}
          SectionParagraph={SectionParagraph}
          CodeBlock={CodeBlock}
        />
      </div>
    </div>
  );
}
