import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { TournamentQuery } from 'src/types/graphql';
import { useUpdateTournamentConfiguration } from 'src/hooksAndQueries/backend/graphql/tournamentConfiguration';
import { useGameDefinitions } from 'src/hooksAndQueries/backend/graphql/gameDefinitions';
import formCssCls from 'src/ui/components/form/Form.module.css';
import headerCssCls from '../components/TournamentSubHeader.module.scss';
import cssCls from './ConfigurationSubPage.module.scss';

const configurationSchema = z.object({
  name: z.string().min(3).max(36),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  gameDefinitionId: z.string().min(1),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});
type FormData = z.infer<typeof configurationSchema>;

interface ConfigurationSubPageProps {
  tournament: Exclude<TournamentQuery['tournament'], null>;
}

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, with no `Z`/offset.
function toDatetimeLocalValue(date: unknown): string {
  if (!date) return '';
  const d = new Date(date as string);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ConfigurationSubPage({ tournament }: ConfigurationSubPageProps) {
  const updateTournamentConfiguration = useUpdateTournamentConfiguration();
  const { gameDefinitions } = useGameDefinitions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      name: tournament.name,
      startDate: toDatetimeLocalValue(tournament.startDate),
      endDate: toDatetimeLocalValue(tournament.endDate),
      gameDefinitionId: tournament.gameDefinitionId ?? '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await updateTournamentConfiguration({
      tournamentID: tournament.id,
      name: data.name,
      // datetime-local inputs have no timezone, `Date` parses them as local time,
      // so `toISOString()` converts them to the UTC `Z` format the backend expects.
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      gameDefinitionId: data.gameDefinitionId,
    });
  };

  return (
    <div className={cssCls.configuration}>
      <div className={headerCssCls.pageHeader}>
        <div className={headerCssCls.iconColumn}>
          <span className={cssCls.headerIcon}><i/></span>
        </div>
        <div className={headerCssCls.titleColumn}>
          <h2><FormattedMessage defaultMessage="Configuration"/></h2>
          <p className={headerCssCls.subtitle}><FormattedMessage defaultMessage="Manage your tournament's settings"/></p>
        </div>
      </div>

      <div className={cssCls.formCard}>
        <form className={formCssCls.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name"><FormattedMessage defaultMessage="Tournament name"/></label>
            <input id="name" {...register('name')} />
            <p className={formCssCls.formError}>{errors.name?.message}</p>
          </div>

          <div>
            <label htmlFor="gameDefinitionId"><FormattedMessage defaultMessage="Game"/></label>
            <select id="gameDefinitionId" {...register('gameDefinitionId')}>
              {gameDefinitions.map((gameDefinition) => (
                <option key={gameDefinition.id} value={gameDefinition.id}>{gameDefinition.name}</option>
              ))}
            </select>
            <p className={formCssCls.formError}>{errors.gameDefinitionId?.message}</p>
          </div>

          <div className={cssCls.dateFields}>
            <div>
              <label htmlFor="startDate"><FormattedMessage defaultMessage="Start date"/></label>
              <input id="startDate" type="datetime-local" {...register('startDate')} />
              <p className={formCssCls.formError}>{errors.startDate?.message}</p>
            </div>
            <div>
              <label htmlFor="endDate"><FormattedMessage defaultMessage="End date"/></label>
              <input id="endDate" type="datetime-local" {...register('endDate')} />
              <p className={formCssCls.formError}>{errors.endDate?.message}</p>
            </div>
          </div>

          <div className={cssCls.actions}>
            {isSubmitSuccessful && (
              <p className={cssCls.successMessage}><FormattedMessage defaultMessage="Configuration saved"/></p>
            )}
            <button className={cssCls.saveAction} type="submit">
              <FormattedMessage defaultMessage="Save"/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}