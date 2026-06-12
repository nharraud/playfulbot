import { ReactNode } from 'react';
import cssCls from './ArenaHeader.module.css';
import { Header } from 'src/ui/components/header/Header';
import { FormattedMessage } from 'react-intl';

interface HeaderProps {
  arenaName?: ReactNode,
  tournamentId?: string,
}
export function ArenaHeader({ arenaName, tournamentId }: HeaderProps) {
  const arenaText = (<FormattedMessage
    defaultMessage="Arena"
  />);

  const tournamentText = (<FormattedMessage
    defaultMessage="Back to Tournament"
  />);

  const upperContent = (
    <div className={cssCls.arenaContent}>
      <div className={cssCls.separator}/>
      <h1 className={cssCls.arenaName}>{arenaText}: {arenaName}</h1>
    </div>
  );
  const backLink={url: `/tournament/${tournamentId}/arenas`, text: tournamentText };
  return (
    <Header upperContent={upperContent} backLink={backLink} fullWidth={true}/>
  );
}