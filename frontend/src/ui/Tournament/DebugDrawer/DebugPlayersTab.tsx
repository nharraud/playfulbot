import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Game } from 'src/types/graphql-generated';
import { PlayerID } from 'src/types/graphql';
import CopyToClipboardButton from '../../../utils/CopyToClipboardButton';

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 650,
  },
  connected: {
    color: theme.palette.success.main,
  },
  not_connected: {
    color: theme.palette.error.main,
  },
}));

const DebugPlayersTab: React.FunctionComponent<{
  game: Game;
}> = (props) => {
  const classes = useStyles();

  function getPlayerNumber(playerID: PlayerID) {
    const playerNumber = props.game?.players.findIndex((player) => player.id === playerID);
    return playerNumber;
  }

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Player Assignment</TableCell>
              <TableCell>Player ID</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Connected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.game?.players.map((player) => (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {`Player ${getPlayerNumber(player.id)}`}
                </TableCell>
                <TableCell>{player.id}</TableCell>
                <TableCell>
                  <CopyToClipboardButton text={player.token}>Copy Token</CopyToClipboardButton>
                </TableCell>
                <TableCell className={classes.not_connected}>
                  {player.connected.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DebugPlayersTab;
