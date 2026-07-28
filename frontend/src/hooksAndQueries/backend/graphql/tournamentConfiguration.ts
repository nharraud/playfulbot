import { TournamentID } from '../../../types/graphql';

export interface UpdateTournamentConfigurationInput {
  tournamentID: TournamentID;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTournamentConfigurationResult {
  id: TournamentID;
  name: string;
  startDate: string;
  endDate: string;
}

// Mocked until the backend exposes a mutation to update the tournament configuration.
export function useUpdateTournamentConfiguration() {
  return (input: UpdateTournamentConfigurationInput) =>
    new Promise<UpdateTournamentConfigurationResult>((resolve) => {
      const { tournamentID, ...rest } = input;
      setTimeout(() => resolve({ id: tournamentID, ...rest }), 300);
    });
}