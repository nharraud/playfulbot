import React, { useState } from 'react';
import { TournamentQuery } from 'src/types/graphql-generated';
import { CodingBotInfoTab } from './infoTabs/CodingBotInfoTab';
import IntroTab from './infoTabs/TournamentInfoTab';
import { GameRulesTab } from './infoTabs/GameRulesTab';
import TournamentSubPage from '../components/TournamentSubPage';

interface TournamentInfoProps {
  tournament?: TournamentQuery['tournament'];
}

export default function InfoSubPage(props: TournamentInfoProps) {
  const sections = [
    ['Tournament', <IntroTab tournament={props.tournament} />],
    ['Game rules', <GameRulesTab />],
    ['Coding a bot', <CodingBotInfoTab />],
  ] as [string, JSX.Element][];

  const [currentSection, setSection] = useState(0);

  return (
    <TournamentSubPage
      title={`Information ${'\u0026'} Rules`}
      sections={sections}
      currentSection={currentSection}
      setSection={setSection}
    />
  );
}
