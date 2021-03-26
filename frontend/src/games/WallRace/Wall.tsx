
import React, { useMemo, useState } from 'react';
import { useChain } from 'react-spring';
import { a, useSpring } from 'react-spring/three'
import Bike from './Bike';
import { Coordinate } from './types';

interface WallSectionProps {
  start: Coordinate
  end: Coordinate
  color: string
  isHead: boolean
}

const WallSection = React.forwardRef((props: WallSectionProps, ref) => {
  const width = Math.abs(props.end[0] - props.start[0]) + 1;
  const height = Math.abs(props.end[1] - props.start[1]) + 1;

  const [animationEnd, setAnimationEnd] = useState(false);
  const [animating, setAnimating] = useState(false);

  const finalPosition = [
    props.start[0] + (props.end[0] - props.start[0]) / 2,
    props.start[1] + (props.end[1] - props.start[1]) / 2,
    1
  ]

  const { size, position, bikePosition} = useSpring({
    ref: ref,
    config: { mass: 1, tension: 1000, friction: 0, clamp: true },
    from: {
      size: [width === 1 ? 1 : 0, height === 1 ? 1 : 0],
      position: [props.start[0], props.start[1]],
      bikePosition: [props.start[0], props.start[1]]
    },
    to: {
      size: [width, height],
      position: finalPosition,
      bikePosition: [props.end[0], props.end[1]]
    },
    onStart: () => setAnimating(true),
    onRest: () => {
      setAnimating(false);
      setAnimationEnd(true);
    }
  })
  let bike = null;
  if (animating || (props.isHead && animationEnd)) {
    bike = <Bike position={bikePosition} color={props.color}/>;
  }
  return (
    <group>
      {bike}
      <a.mesh position={position} scale={size}>
        <planeBufferGeometry attach="geometry"/>
        <meshBasicMaterial attach="material" color={props.color}/>
      </a.mesh>
    </group>
  );
});

interface WallPropsInterface {
  points: Coordinate[]
  color: string
}

export function Wall(props: WallPropsInterface) {
  const refs = React.useRef([]);

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

  refs.current = wallSections.map((_, i) => refs.current[i] ?? React.createRef());

  const wallShapes = wallSections.map((section, index) => (
    <WallSection start={section[0]} end={section[1]} key={index - 1}
    ref={refs.current[index]}
    color={props.color}
    isHead={index === wallSections.length - 1}
    />
  ));
  
  useChain(refs.current);

  return (
    <group>
      {wallShapes}
    </group>
  )
}