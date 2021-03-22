import React from 'react';
import TurnCounter from './TurnCounter';
import { Background } from './Background';
import OrdersBar from './OrdersBar';
import { useThree } from 'react-three-fiber';

export default function ChefAuction(props) {
  const gameState = {
    end: false,
    orders: [
      { dish: 'cake', ingredients: [ 'apple', 'coconut', 'plums' ] },
      { dish: 'cupcake', ingredients: [ 'blue_grapes', 'plums', 'pear' ] },
      { dish: 'yogourt', ingredients: [ 'coconut', 'strawberry', 'apple' ] },
      { dish: 'jelly', ingredients: [ 'coconut', 'pineapple', 'apple' ] },
    ]
  }
  // const ingredients: [string, string, string] = [ 'apple', 'coconut', 'blue_grapes'];
  const { viewport } = useThree();
  const scaleFactor = Math.min(viewport.width/17, viewport.height/7);
  return (
    <group scale={[scaleFactor, scaleFactor, 1]}>
      <Background />
      <TurnCounter position={[5, 2.5, 0]}/>
      <OrdersBar orders={gameState.orders}/>
    </group>
  );
}