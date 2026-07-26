import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'src/ui/components/modal/Modal';
import cssCls from './CreateTournamentModal.module.scss';
import { Tournament } from 'src/types/graphql';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateTournament } from 'src/hooksAndQueries/backend/graphql/tournament';

const tournamentSchema = z.object({
  name: z.string().min(3).max(36),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});
type FormData = z.infer<typeof tournamentSchema>;

interface CreateTournamentModalProps {
  isOpen: Boolean;
  onClose: () => void;
  onCreate?: (result: { tournament: Pick<Tournament, 'id' | 'name'> | null }) => void;
}

export default function CreateTournamentModal(props: CreateTournamentModalProps) {
  const createTournament = useCreateTournament();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(tournamentSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const tournament = await createTournament(data);
    props.onClose();
    props.onCreate?.({ tournament });
  };

  return (
    <Modal
      className={cssCls.modal}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <h2 className={cssCls.title}><FormattedMessage defaultMessage="Create new Tournament"/></h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label><FormattedMessage defaultMessage="Tournament name"/></label>
        <input {...register('name')} />
        <p role="alert">{errors.name?.message}</p>

        <label><FormattedMessage defaultMessage="Start date"/></label>
        <input type="date" {...register('startDate')} />
        <p role="alert">{errors.startDate?.message}</p>

        <label><FormattedMessage defaultMessage="End date"/></label>
        <input type="date" {...register('endDate')} />
        <p role="alert">{errors.endDate?.message}</p>

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