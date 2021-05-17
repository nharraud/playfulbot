import React from 'react';
import { TournamentQuery } from 'src/types/graphql-generated';

interface TournamentInfoProps {
  tournament?: TournamentQuery['tournament'];
};

export default function Info(props: TournamentInfoProps) {

  return (
    <>
    Thist is a test
    </>
  )
}