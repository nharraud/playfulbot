import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import DebugPlayersTab from './DebugPlayersTab';

import copy from 'copy-to-clipboard';

jest.mock('copy-to-clipboard');

const game = {
  id: '0',
  version: 0,
  players: [
    {playerNumber: 0, user: {id: '10', username: 'user0'}, token: 'token0'},
    {playerNumber: 1, user: {id: '11', username: 'user1'}, token: 'token1'},
  ],
  gameState: {
    end: false,
    players: [
      {points: 0, playing: true},
      {points: 0, playing: false},
    ]
  }
};

test('Every player is listed', () => {
  render(<DebugPlayersTab game={game} />);
  const players = screen.getByRole('table');
  const rows = within(players).getAllByRole('row');
  expect(rows).toHaveLength(3);

  rows.slice(1).forEach((row, rowIndex) => {
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(3);
    expect(cells[0].textContent).toEqual(`Player ${rowIndex}`);
  });
});

test('Copying the token works', () => {
  render(<DebugPlayersTab game={game} />);
  const players = screen.getByRole('table');
  const buttons = within(players).getAllByRole('button', { name:/copy token/i });
  expect(buttons).toHaveLength(2);

  buttons.forEach((button, index) => {
    fireEvent.click(button);
    expect(copy).toHaveBeenCalledWith(game.players[index].token, {format: 'text/plain'});
  })
  expect(copy).toHaveBeenCalledTimes(buttons.length);
});