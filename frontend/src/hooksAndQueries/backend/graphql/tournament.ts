import { useMutation } from '@apollo/client/react';
import * as gqlTypes from '../../../types/graphql';

import { graphql } from '../../../types/backend/graphql';

const createTournamentMutation = graphql(`
  mutation createTournament(
    $name: String!,
    $startDate: Date!,
    $endDate: Date!,
  ) {
    createTournament(
      name: $name
      startDate: $startDate,
      endDate: $endDate,
    ) {
      id
      name
    }
  }
`);

export function useCreateTournament() {
  const [createTournament] = useMutation(
    createTournamentMutation
  );

  return ({ name, startDate, endDate }: {
    name: string,
    startDate: gqlTypes.Scalars['Date']['input'],
    endDate: gqlTypes.Scalars['Date']['input'],
  }) => new Promise<gqlTypes.CreateTournamentMutation['createTournament']>(
    (resolve) => createTournament({
      variables: { name, startDate, endDate },
      refetchQueries: ['authenticatedUserTournaments'],
      onCompleted: data => resolve(data.createTournament),
    })
  );
}
