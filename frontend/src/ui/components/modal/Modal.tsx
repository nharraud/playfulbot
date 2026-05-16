import { useEffect, useRef, ReactNode } from 'react';
import cssCls from './Modal.module.css';

type ModalProps = {
  isOpen: Boolean,
  /** callback called when the modal closes */
  onClose: () => void,
  className?: string,
  children?: ReactNode | ReactNode[],
};

export function Modal({ isOpen, onClose, className, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current as HTMLDialogElement;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className={`${cssCls.modal} ${className}`}
      onClick={(e) => {
        // Close if the backdrop (the dialog itself) is clicked.
        // The modalContentWrapper prevents closing if we click the modal content.
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className={cssCls.modalContentWrapper}>
        {children}
      </div>
    </dialog>
  );
}