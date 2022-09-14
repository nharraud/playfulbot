
import React, { useMemo } from 'react';
import { a } from '@react-spring/three'
import Bike from './Bike';
import { Coordinate } from '../../types';

interface WallSectionProps {
  start: Coordinate
  end: Coordinate
  color: string
  isHead: boolean
}

const WallSection = (props: WallSectionProps) => {
  const width = Math.abs(props.end[0] - props.start[0]) + 1;
  const height = Math.abs(props.end[1] - props.start[1]) + 1;

  const position = [
    props.start[0] + 0.5 + (props.end[0] - props.start[0]) / 2,
    props.start[1] + 0.5 + (props.end[1] - props.start[1]) / 2,
    1
  ] as [number, number, number];
  const bikePosition = [props.end[0] + 0.5, props.end[1] + 0.5, 1] as [number, number, number];
  const size = [width, height];

  let bike: JSX.Element | undefined = undefined;
  if (props.isHead) {
     bike = <Bike position={bikePosition} color={props.color}/>;
  }
  return (
    <group>
      {bike}
      <a.mesh position={position} scale={size as any}>
        <planeBufferGeometry attach="geometry"/>
        <meshBasicMaterial attach="material" color={props.color}/>
      </a.mesh>
    </group>
  );
};

interface WallPropsInterface {
  points: Coordinate[]
  color: string
}

export function Wall(props: WallPropsInterface) {
  const wallSections = useMemo(() => {
    const sectionsArray = [];
    let wallStart = props.points[0];
    for (const [index, wallEnd] of props.points.entries()) {
      if (index === 0) continue;
      sectionsArray.push([wallStart, wallEnd]);
      wallStart = wallEnd;
    }
    return sectionsArray;
  }, [props.points])

  const wallShapes = useMemo(() =>
  wallSections.map((section, index) => (
    <WallSection start={section[0]} end={section[1]} key={index - 1}
    color={props.color}
    isHead={index === wallSections.length - 1}
    />
  )), [wallSections, props.color]);

  return (
    <group>
      {wallShapes}
    </group>
  )
}