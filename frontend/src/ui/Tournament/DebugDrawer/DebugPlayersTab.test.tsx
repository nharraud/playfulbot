import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import copy from 'copy-to-clipboard';
import DebugPlayersTab from './DebugPlayersTab';

jest.mock('copy-to-clipboard');

// const gameSchedule: GameSchedule<any> = {
//   id: 'schedule 0',
//   players: [
//     {id: 'player 0', token: 'token 1'},
//     {id: 'player 1', token: 'token 1'},
//   ],
//   game: {
//     id: 'game 0',
//     version: 0,
//     assignments: [
//       {playerNumber: 0, playerID: 'player 0'},
//       {playerNumber: 1, playerID: 'player 1'},
//     ],
//     gameState: {
//       end: false,
//       players: [
//         {points: 0, playing: true},
//         {points: 0, playing: false},
//       ]
//     }
//   }
// };

// test('Every player is listed', () => {
//   render(<DebugPlayersTab gameSchedule={gameSchedule} />);
//   const players = screen.getByRole('table');
//   const rows = within(players).getAllByRole('row');
//   expect(rows).toHaveLength(3);

//   rows.slice(1).forEach((row, rowIndex) => {
//     const cells = within(row).getAllByRole('cell');
//     expect(cells).toHaveLength(4);
//     expect(cells[0].textContent).toEqual(`Player ${rowIndex}`);
//     expect(cells[1].textContent).toEqual(gameSchedule.players[rowIndex].id);
//   });
// });

// test('Copying the token works', () => {
//   render(<DebugPlayersTab gameSchedule={gameSchedule} />);
//   const players = screen.getByRole('table');
//   const buttons = within(players).getAllByRole('button', { name:/copy token/i });
//   expect(buttons).toHaveLength(2);

//   buttons.forEach((button, index) => {
//     fireEvent.click(button);
//     expect(copy).toHaveBeenCalledWith(gameSchedule.players[index].token, {format: 'text/plain'});
//   })
//   expect(copy).toHaveBeenCalledTimes(buttons.length);
// });
