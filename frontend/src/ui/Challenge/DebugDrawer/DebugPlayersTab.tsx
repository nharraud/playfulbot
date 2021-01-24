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

import { Game } from 'src/types/graphql';
import { GameState } from 'src/types/gameState';

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
  game: Game<GameState>,
}> = (props) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Connected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.game.players.map((player) => (
              <TableRow key={player.playerNumber}>
                <TableCell component="th" scope="row">
                  Player {player.playerNumber}
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