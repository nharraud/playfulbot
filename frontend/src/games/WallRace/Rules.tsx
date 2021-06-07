import React from 'react';
import { RulesProps } from '../GameDefinition';

export function Rules({SectionTitle, SectionParagraph, CodeBlock}: RulesProps) {
  return (
    <>
      <SectionTitle>Game Principle</SectionTitle>
      <SectionParagraph>
        The Game board is composed of a 2 dimension grid. Each square of the grid is called
        a 'cell'. Each player controls a vehicle which has to move at each turn to a free cell.
        A cell is free if no vehicle is, or has been, on this cell. Vehicles cannot go out of the grid.
        The first vehicle to move into a non-free cell loses. Both players play at the same time without
        knowing the move of the opponent. Both players lose if they move their vehicles to a non-free
        cell during the same turn.
      </SectionParagraph>

      <SectionTitle>Actions</SectionTitle>
      <SectionParagraph>
        Bots give at each turn the direction in which their vehicle will move. The game action looks like this:
      </SectionParagraph>
      <CodeBlock>
        {`
        { vector: [0, 1] } // Move up
        { vector: [0, -1] } // Move down
        { vector: [1, 0] } // Move left
        { vector: [-1, 0] } // Move right
        `}
      </CodeBlock>
      <SectionParagraph>
        Note that bots cannot move in diagonal.
      </SectionParagraph>

      <SectionTitle>Game State</SectionTitle>
      <SectionParagraph>
        At each turn your AI will receive the state of the game. Here is an example:
      </SectionParagraph>
      <CodeBlock>
        {`
            {
              arena: {
                size: 42 // the size of the arena. The arena is always square.
              }
              walls: [
                [[0, 0], [0, 3], [8, 3]], // player 0's path. The vehicle is at the last coordinate. i.e. [8, 3]
                [[42, 42], [40, 42], [40, 38], [35, 38]] // player 1's path. The vehicle is at [35, 38]
                // Note that each coordinate in a path is a turning point.
              ]
            }
        `}
      </CodeBlock>
    </>
  )
}