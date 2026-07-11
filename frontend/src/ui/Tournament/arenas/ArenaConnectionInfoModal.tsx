import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'src/ui/components/modal/Modal';
import cssCls from './ArenaConnectionInfoModal.module.scss';
import { Arena } from 'src/types/graphql';

interface CreateArenaModalProps {
  isOpen: Boolean;
  onClose: () => void;
  arena?: Arena;
}

export default function ArenaConnectionInfoModal(props: CreateArenaModalProps) {
  const intl = useIntl();
  const copyTokenLabel = intl.formatMessage({ defaultMessage: 'Copy token' });
  const tokens = props.arena?.players?.map((player, idx) => {
    const playerText = (<FormattedMessage
      defaultMessage="Player {playerNb}"
      values={{ playerNb: idx }}
    />);
    const fieldId = `token${idx}`;
    return (
      <div key={`playerToken${idx}`}>
        <label htmlFor={fieldId}>{playerText}</label>
        <div className={cssCls.playerTokenRow}>
          <input id={fieldId} className={cssCls.playerTokenInput} type='text' value={player?.token} readonly disabled/>
          <button
            type='button'
            className={cssCls.copyButton}
            onClick={() => {
              console.log('GNI! ' + player?.token)
              return navigator.clipboard.writeText(player?.token ?? '');
            }}
            aria-label={copyTokenLabel}
          ><i/></button>
        </div>
      </div>
    )
  });
  return (
    <Modal
      className={cssCls.modal}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <h2 className={cssCls.title}><FormattedMessage defaultMessage="How to connect a bot to this Arena"/></h2>
      {tokens}
      <button className={cssCls.closeButton} onClick={props.onClose}><FormattedMessage defaultMessage="Close"/></button>
    </Modal>
  );
}
