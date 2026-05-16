import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'src/ui/components/modal/Modal';
import cssCls from './CreateArenaModal.module.css';
import { Arena, CreateArenaFailure } from 'src/types/graphql';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateArena } from 'src/hooksAndQueries/backend/graphql/arena';
import { useTeam } from 'src/hooksAndQueries/backend/graphql/team';
import { isFailure } from 'src/hooksAndQueries/backend/graphql/isFailure';

const arenaSchema = z.object({
  name: z.string().min(3).max(36),
});
type FormData = z.infer<typeof arenaSchema>;

interface CreateArenaModalProps {
  isOpen: Boolean;
  onClose: () => void;
  onCreate: (result: { arena?: Pick<Arena, 'id' | 'name'> }) => void;
  teamId?: string;
}

export default function CreateArenaModal(props: CreateArenaModalProps) {
  const createArena = useCreateArena();
  const user = useTeam()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
      resolver: zodResolver(arenaSchema),
    })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!props.teamId) {
      return;
    }
    await createArena({ teamID: props.teamId, name: data.name }).then(result => {
      if (isFailure<CreateArenaFailure>(result)) {
        console.error('Failed to create Arena', result.errors);
      } else {
        props.onClose();
        return props.onCreate({ arena: result?.arena });
      }
    });
  }

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
