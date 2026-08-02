import React from 'react';
import { CellValue } from '../../types';
import { symbolColor } from './player';

interface MarkProps {
  symbol: Exclude<CellValue, null>;
  position: [number, number, number];
}

export function Mark({ symbol, position }: MarkProps) {
  const color = symbolColor(symbol);

  if (symbol === 'x') {
    return (
      <group position={position}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.7, 0.12, 0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.7, 0.12, 0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={position}>
      <torusGeometry args={[0.3, 0.06, 16, 32]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
