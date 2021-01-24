import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const DebugGameTab: React.FunctionComponent<{
  createDebugGame: () => void,
}> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button variant="contained" size="small" color="primary" onClick={props.createDebugGame}>
        Create New Debug Game
      </Button>
    </div>
  );
}

export default DebugGameTab;