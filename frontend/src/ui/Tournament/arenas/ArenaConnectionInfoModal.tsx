import { FormattedMessage } from 'react-intl';
import { Modal } from 'src/ui/components/modal/Modal';
import cssCls from './ArenaConnectionInfoModal.module.scss';
import { Arena } from 'src/types/graphql';

interface CreateArenaModalProps {
  isOpen: Boolean;
  onClose: () => void;
  arena?: Arena;
}

export default function ArenaConnectionInfoModal(props: CreateArenaModalProps) {
  const tokens = props.arena?.players?.map((player, idx) => {
    const playerText = (<FormattedMessage
      defaultMessage="Player {playerNb}"
      values={{ playerNb: idx }}
    />);
    const fieldId = `token${idx}`;
    return (
      <div key={`playerToken${idx}`}>
        <label htmlFor={fieldId}>{playerText}</label>
        <input id={fieldId} className={cssCls.playerTokenInput} type='text' value={player?.token} readonly disabled/>
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
