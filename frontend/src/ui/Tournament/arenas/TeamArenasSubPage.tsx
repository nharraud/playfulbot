import React, { useRef, useState } from 'react';
import { useTeamArenas } from 'src/hooksAndQueries/backend/graphql/arena';
import { TournamentQuery } from 'src/types/graphql';
import cssCls from './TeamArenasSubPage.module.css';
import headerCssCls from '../components/TournamentSubHeader.module.css';
import { Link, useMatch } from 'react-router';
import { FormattedMessage } from 'react-intl';
import CreateArenaModal from './CreateArenaModal';

interface TournamentArenasProps {
  tournament?: TournamentQuery['tournament'];
}

export default function TeamArenasSubPage(props: TournamentArenasProps) {
  const match = useMatch('/tournament/:tournamentID/:page');
  const baseURL = `/tournament/${match?.params?.tournamentID}/${match?.params?.page}`;
  const [createArenaModalOpen, setCreateArenaModalOpen] = useState(false);

  const result = useTeamArenas(props.tournament?.id);
  const arenasElt = result.arenas?.map(arena =>
    <Link to={`${baseURL}/${arena.id}`} className={cssCls.arena}>
      <div>{arena.name}</div>
    </Link>
  );
  return (
    <div className={cssCls.teamArenas}>
      <CreateArenaModal
        isOpen={createArenaModalOpen}
        onClose={() => setCreateArenaModalOpen(false)}
        onCreate={() => result.refetch()}
      />
      <div className={headerCssCls.pageHeader}>
        <div className={headerCssCls.iconColumn}>
          <span className={cssCls.headerIcon}><i/></span>
        </div>
        <div className={headerCssCls.titleColumn}>
          <h2><FormattedMessage defaultMessage="Test Arenas"/></h2>
          <p className={headerCssCls.subtitle}><FormattedMessage defaultMessage="Test and debug your bot in an arena"/></p>
        </div>
        <div className={headerCssCls.actionColumn}>
          <button onClick={() => setCreateArenaModalOpen(true)}><i className={cssCls.createArenaIcon}/><FormattedMessage defaultMessage="Create Arena"/></button>
        </div>
      </div>
      {arenasElt}
    </div>
  );
}
