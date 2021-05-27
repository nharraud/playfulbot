import { Game } from '~playfulbot/model/Game';
import { Player, PlayerID } from '~playfulbot/model/Player';

export function getGamesBetweenPlayers(player0: PlayerID, player1: PlayerID): Game[] {
  const isGameBetweenPlayers = (game: Game) =>
    game.players.find((assignment) => assignment.playerID === player0) &&
    game.players.find((assignment) => assignment.playerID === player1);
  return [...Player.getPlayer(player0).games]
    .map((gameID) => Game.getGame(gameID))
    .filter(isGameBetweenPlayers);
}
