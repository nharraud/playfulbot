
import { useGame } from 'src/hooksAndQueries/game-runner/graphql/useGame';
import { useGameController } from 'src/hooksAndQueries/useGameController';
import { useGameDefinition } from 'src/hooksAndQueries/useGameDefinition';
import cssCls from './GameArenaDisplay.module.scss';
import { useCreateArenaGame } from 'src/hooksAndQueries/backend/graphql/useArenaGame';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import ArenaConnectionInfoModal from './ArenaConnectionInfoModal';
import { Arena } from 'src/types/graphql';

interface GameArenaDisplayProps {
  gameID?: string
  arena?: Arena
  createGame?: () => void
  gameDefinitionId?: string | null
}

export function GameArenaDisplay(props: GameArenaDisplayProps) {
  const gameResult = useGame(props.gameID);

  const  { controlledGame, setGameVersion } = useGameController(gameResult?.game);

  const gameDefinition = useGameDefinition(props.gameDefinitionId);


  const newGameText = (<FormattedMessage
    defaultMessage="New game"
  />);
  const connectionInfoText = (<FormattedMessage
    defaultMessage="Bot Connection Info"
  />);
  const [connectionInfoModalOpen, setConnectionInfoModalOpen] = useState(false);

  return (
    <div className={cssCls.gameArenaDisplayContainer}>
      {/* <p>{JSON.stringify(gameResult?.game?.players)}</p>
      <p>{JSON.stringify(controlledGame)}</p> */}
      <div className={cssCls.gameColumn}>
        <div className={cssCls.gameContainer}>
          {gameDefinition && <gameDefinition.game gameState={controlledGame?.gameState} />}
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
        <button className={cssCls.newGameButton} onClick={props.createGame}>{newGameText}</button>
        <button className={cssCls.connectionInfoButton} onClick={() => setConnectionInfoModalOpen(true)}>{connectionInfoText}</button>
      </div>

      <ArenaConnectionInfoModal
        isOpen={connectionInfoModalOpen}
        onClose={() => setConnectionInfoModalOpen(false)}
        arena={props.arena}
      />
    </div>
  );
}