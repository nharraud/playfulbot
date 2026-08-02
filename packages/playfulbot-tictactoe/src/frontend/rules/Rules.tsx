import React from 'react';
import { RulesProps } from 'playfulbot-game-frontend';

export function Rules({SectionTitle, SectionParagraph, CodeBlock}: RulesProps) {
  return (
    <>
      <SectionTitle>Game Principle</SectionTitle>
      <SectionParagraph>
        The game board is a 3x3 grid. Player 0 plays 'x', player 1 plays 'o'. Players take turns
        placing their symbol on an empty cell of the grid. The first player to align three of
        their symbols in a row, column, or diagonal wins. If the grid fills up with no winner,
        the game ends in a draw.
      </SectionParagraph>

      <SectionTitle>Actions</SectionTitle>
      <SectionParagraph>
        On your turn, give the row and column of the cell you want to play. The game action looks
        like this:
      </SectionParagraph>
      <CodeBlock>
        {`
        [0, 0] // Play the top-left cell
        [1, 1] // Play the center cell
        [2, 2] // Play the bottom-right cell
        `}
      </CodeBlock>
      <SectionParagraph>
        A cell is identified by its row then its column, both ranging from 0 to 2.
      </SectionParagraph>

      <SectionTitle>Game State</SectionTitle>
      <SectionParagraph>
        At each turn your AI will receive the state of the game. Here is an example:
      </SectionParagraph>
      <CodeBlock>
        {`
            {
              board: [
                ['x', null, null],
                [null, 'o', null],
                [null, null, null],
              ]
            }
        `}
      </CodeBlock>
    </>
  )
}
