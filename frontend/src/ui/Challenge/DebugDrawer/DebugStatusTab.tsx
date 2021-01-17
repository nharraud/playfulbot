import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import CopyToClipboardButton from '../../../utils/CopyToClipboardButton';

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 650,
  },
  connected: {
    color: theme.palette.success.main
  },
  not_connected: {
    color: theme.palette.error.main
  }
}));

export default function DebugStatusTab(props) {
  const classes = useStyles();

  let players = null;
  players = (
    <>
    <Button variant="contained" size="small" color="primary" onClick={props.createDebugGame}>
      Create New Debug Game
    </Button>
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Connected</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.game.data.players.map((player) => (
            <TableRow key={player.playerNumber}>
              <TableCell component="th" scope="row">
                {player.playerNumber}
              </TableCell>
              <TableCell component="th" scope="row">
                <CopyToClipboardButton text={player.token}>
                  Copy Token
                </CopyToClipboardButton>
              </TableCell>
              <TableCell className={classes.not_connected} component="th" scope="row">
                Not connected
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
  
  return (
    <div className={classes.root}>
      {players}
    </div>
  );
}