import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import CopyToClipboardButton from '../../../utils/CopyToClipboardButton';

import { Game } from 'src/types/graphql-generated';
import { PlayerID } from 'src/types/graphql';

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

const DebugPlayersTab: React.FunctionComponent<{
  game: Game,
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
                <TableCell>
                  {player.id}
                </TableCell>
                <TableCell>
                  <CopyToClipboardButton text={player.token}>
                    Copy Token
                  </CopyToClipboardButton>
                </TableCell>
                <TableCell className={classes.not_connected}>
                  Not connected
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DebugPlayersTab;