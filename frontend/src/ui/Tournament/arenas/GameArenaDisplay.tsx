
import { useGame } from 'src/hooksAndQueries/game-runner/graphql/useGame';
import { useGameController } from 'src/hooksAndQueries/useGameController';
import { gameDefinition } from 'playfulbot-config';
import cssCls from './GameArenaDisplay.module.scss';
import { useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { FormattedMessage } from 'react-intl';

interface GameArenaDisplayProps {
  gameID?: string
  arenaId?: string
}

export function GameArenaDisplay(props: GameArenaDisplayProps) {
  const gameResult = useGame(props.gameID);

  const newGameText = (<FormattedMessage
    defaultMessage="New Game"
  />);
  const createGame = useCreateArenaGame(props.arenaId);

  const  { controlledGame, setGameVersion } = useGameController(gameResult?.game);

  return (
    <div className={cssCls.gameArenaDisplayContainer}>
      {/* <p>{JSON.stringify(gameResult?.game?.players)}</p>
      <p>{JSON.stringify(controlledGame)}</p> */}
      <div className={cssCls.gameColumn}>
        <div className={cssCls.gameContainer}>
          <gameDefinition.game gameState={controlledGame?.gameState} />
        </div>
        <br/>
        <input className={cssCls.revisionSelector}
          type='range' id='version' name='version' min='0'
          max={controlledGame?.maxVersion?.toString() || '0'}
          value={controlledGame?.version?.toString() || '0'}
          onChange={e => setGameVersion(parseInt(e.target.value, 10))}
        />
      </div>
      <div className={cssCls.arenaMenu}>
        <button className={cssCls.newGameButton} onClick={createGame}>{newGameText}</button>
      </div>
    </div>
  );
}