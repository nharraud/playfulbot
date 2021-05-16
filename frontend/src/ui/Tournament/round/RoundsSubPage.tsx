
import React from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Team, Tournament } from "src/types/graphql-generated";
import {
  useRouteMatch,
} from 'react-router-dom';
import useRoundSummary from 'src/hooksAndQueries/useRoundSummary';
import useTeam from 'src/hooksAndQueries/useTeam';
import { GameID } from 'src/types/graphql';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  title: {
    textAlign: "left",
    marginLeft: theme.spacing(12),
    marginBottom: theme.spacing(7),
    marginTop: theme.spacing(2),
  },
  table: {}
}));

interface RoundSubPageProps {
  tournament?: Tournament | undefined;
}

export default function RoundSubPage(props: RoundSubPageProps) {
  const classes = useStyles();
  const match = useRouteMatch<{tournamentID: string, roundID: string}>({
    path: "/tournament/:tournamentID/competition/rounds/:roundID",
    strict: true,
    sensitive: true
  });
  const { team } = useTeam(props.tournament?.id);
  const { round } = useRoundSummary(match.params.roundID, team?.id);

  let games = new Array<{ id: GameID, won: boolean, opponents: Team[] }>();
  if (round !== undefined) {
    games = round.teamGames.map((game) => {
      const losers = game.losers.filter((loser) => loser.id !== team.id);
      const winners = game.winners.filter((winner) => winner.id !== team.id);
      const opponents = losers.concat(winners);

      const won = game.winners.findIndex((winner) => winner.id === team.id) !== -1;
      return { id: game.id, won, opponents }
    });
  }
  return (
    <div className={classes.root}>

      <Typography variant="h4" className={classes.title}>
        Round summary
      </Typography>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Opposing teams</TableCell>
              {/* <TableCell align="right">Team's victories this round</TableCell> */}
              <TableCell align="right">Game result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell component="th" scope="row">
                  {game.opponents.map((opponent) => (
                    <div>{opponent.name}</div>
                  ))}
                </TableCell>
                <TableCell align="right">{game.won ? 'Victory' : 'Defeat'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
