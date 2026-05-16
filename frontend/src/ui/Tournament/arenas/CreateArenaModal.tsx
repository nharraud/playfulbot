import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'src/ui/components/modal/Modal';
import cssCls from './CreateArenaModal.module.css';
import { Arena } from 'src/types/graphql';
import { SubmitHandler, useForm } from 'react-hook-form';

const arenaSchema = z.object({
  name: z.string().min(3).max(36),
});
type FormData = z.infer<typeof arenaSchema>;

interface CreateArenaModalProps {
  isOpen: Boolean;
  onClose: () => void;
  onCreate: (arena: Arena) => void
}


export default function CreateArenaModal(props: CreateArenaModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
      resolver: zodResolver(arenaSchema),
    })

  const onSubmit: SubmitHandler<FormData> = (data) => props.onCreate(data);

  return (
    <Modal
      className={cssCls.modal}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <h2 className={cssCls.title}><FormattedMessage defaultMessage="Create new Arena"/></h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label><FormattedMessage defaultMessage="Arena name"/></label>
        <input {...register('name')} />
        <p role="alert">{errors.name?.message}</p>

        <div className={cssCls.actions}>
          <button className={cssCls.cancelAction} onClick={props.onClose}>
            <FormattedMessage defaultMessage="Cancel"/>
          </button>
          <button className={cssCls.createAction} type="submit">
            <FormattedMessage defaultMessage="Create"/>
          </button>
        </div>

      </form>
    </Modal>
  );
}
