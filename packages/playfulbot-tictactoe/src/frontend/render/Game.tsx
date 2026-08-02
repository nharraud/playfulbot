import React, { useEffect, useState } from 'react';
import { TicTacToeGameState } from '../../types';
import { useThree } from '@react-three/fiber';
import Grid from './Grid';
import { Mark } from './Mark';

interface GamePropsInterface {
  gameState: TicTacToeGameState;
}

const BOARD_SIZE = 3;

export function Game(props: GamePropsInterface) {
  // rescale the board to fit the screen
  const [ scale, setScale ] = useState(0);
  const [ translation, setTranslation ] = useState(0);
  const { viewport } = useThree();
  useEffect(() => {
    const minViewPort = viewport.width < viewport.height ? viewport.width : viewport.height;
    const ratio = minViewPort / BOARD_SIZE * 0.9;
    setScale(ratio);
    setTranslation(BOARD_SIZE / 2 * ratio);
  }, [viewport]);

  return (
    <group
        position={[-translation, -translation, 0]}
        scale={[scale, scale, 1]}>
      <group position={[0, 0, 0]}>
        <Grid size={BOARD_SIZE} />
      </group>
      <group position={[0, 0, 1]}>
        {props.gameState.board.map((row, rowIndex) =>
          row.map((symbol, colIndex) => symbol && (
            <Mark
              key={`${rowIndex}-${colIndex}`}
              symbol={symbol}
              position={[colIndex + 0.5, BOARD_SIZE - 1 - rowIndex + 0.5, 0]}
            />
          ))
        )}
      </group>
    </group>
  );
}
