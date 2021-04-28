import { useSubscription } from '@apollo/client';
import { client as apolloClient } from '../apolloConfig';

import * as gqlTypes from '../types/graphql';


export function useTeamPlayer(teamID: string) {
  const {data, loading, error} = useSubscription<gqlTypes.TeamPlayerSubscription>(gqlTypes.TeamPlayerDocument, {
    variables: { teamID: teamID },
    skip: !teamID,
    shouldResubscribe: true,
  });

  let player: gqlTypes.Player = undefined;

  if (!data) {
    player = undefined;
  } else if (data.teamPlayer.__typename === 'Player') {
    player = data.teamPlayer;
  } else if (data.teamPlayer.__typename === 'PlayerConnection') {
    apolloClient.writeFragment({
      id: `Player:${data.teamPlayer.playerID}`,
      fragment: gqlTypes.PlayerConnectedFragmentDoc,
      data: {
        connected: data.teamPlayer.connected
      },
    });
    player = apolloClient.readFragment<gqlTypes.PlayerFragment>({
      id: `Player:${data.teamPlayer.playerID}`,
      fragment: gqlTypes.PlayerFragmentDoc
    });
  }
  return { player }
}
