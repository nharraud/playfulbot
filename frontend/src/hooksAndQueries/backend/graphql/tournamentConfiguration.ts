import { useMutation } from '@apollo/client/react';
import { TournamentID } from '../../../types/graphql';

import { graphql } from '../../../types/backend/graphql';

export interface UpdateTournamentConfigurationInput {
  tournamentID: TournamentID;
  name: string;
  startDate: string;
  endDate: string;
  gameDefinitionId: string;
}

export interface UpdateTournamentConfigurationResult {
  id: TournamentID;
  name: string;
  startDate: string;
  endDate: string;
  gameDefinitionId: string;
}

const updateTournamentConfigurationMutation = graphql(`
  mutation updateTournamentConfiguration($tournamentID: ID!, $input: TournamentConfigurationInput!) {
    updateTournamentConfiguration(tournamentID: $tournamentID, input: $input) {
      ... on UpdateTournamentConfigurationSuccess {
        tournament {
          id
          name
          startDate
          endDate
          gameDefinitionId
        }
      }
      ... on UpdateTournamentConfigurationFailure {
        errors {
          ... on Error {
            message
          }
        }
      }
    }
  }
`);

export function useUpdateTournamentConfiguration() {
  const [updateTournamentConfiguration] = useMutation(
    updateTournamentConfigurationMutation
  );

  return ({ tournamentID, name, startDate, endDate, gameDefinitionId }: UpdateTournamentConfigurationInput) =>
    new Promise<UpdateTournamentConfigurationResult>((resolve, reject) => {
      updateTournamentConfiguration({
        variables: { tournamentID, input: { name, startDate, endDate, gameDefinitionId } },
        onCompleted: (data) => {
          const result = data.updateTournamentConfiguration;
          if (result?.__typename === 'UpdateTournamentConfigurationSuccess' && result.tournament) {
            resolve({
              id: result.tournament.id,
              name: result.tournament.name,
              startDate: result.tournament.startDate as string,
              endDate: result.tournament.endDate as string,
              gameDefinitionId: result.tournament.gameDefinitionId as string,
            });
          } else if (result?.__typename === 'UpdateTournamentConfigurationFailure') {
            reject(new Error(result.errors[0]?.message || 'Failed to update tournament configuration'));
          } else {
            reject(new Error('Failed to update tournament configuration'));
          }
        },
        onError: (error) => reject(error),
      });
    });
}