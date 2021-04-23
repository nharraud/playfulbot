import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type Tournament = {
  __typename?: 'Tournament';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  name: Scalars['String'];
  members?: Maybe<Array<Maybe<User>>>;
};

export type UserNotPartOfAnyTeam = {
  __typename?: 'UserNotPartOfAnyTeam';
  message: Scalars['String'];
};

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type LoginResult = {
  __typename?: 'LoginResult';
  user: User;
  token: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  id?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
  canceled?: Maybe<Scalars['Boolean']>;
  players?: Maybe<Array<Maybe<Player>>>;
  gameState: Scalars['JSON'];
};

export type GamePatch = {
  __typename?: 'GamePatch';
  patch?: Maybe<Scalars['JSON']>;
  gameID?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
};

export type GameCanceled = {
  __typename?: 'GameCanceled';
  gameID?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  playerID?: Maybe<Scalars['ID']>;
  connected?: Maybe<Scalars['Boolean']>;
};

export type LiveGame = Game | GamePatch | GameCanceled | PlayerConnection;

export type Player = {
  __typename?: 'Player';
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
  connected?: Maybe<Scalars['Boolean']>;
};

export type DebugArena = {
  __typename?: 'DebugArena';
  id?: Maybe<Scalars['ID']>;
  game?: Maybe<Scalars['ID']>;
};

export type PlayerGames = {
  __typename?: 'PlayerGames';
  playerID?: Maybe<Scalars['ID']>;
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type NewPlayerGames = {
  __typename?: 'NewPlayerGames';
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type LivePlayerGames = PlayerGames | NewPlayerGames;

export type Subscription = {
  __typename?: 'Subscription';
  game?: Maybe<LiveGame>;
  debugArena?: Maybe<DebugArena>;
  playerGames?: Maybe<LivePlayerGames>;
};


export type SubscriptionGameArgs = {
  gameID: Scalars['ID'];
};


export type SubscriptionDebugArenaArgs = {
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
};


export type SubscriptionPlayerGamesArgs = {
  playerID: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  tournament?: Maybe<Tournament>;
  team?: Maybe<UserTeamResult>;
  authenticatedUser?: Maybe<User>;
};


export type QueryTournamentArgs = {
  tournamentID?: Maybe<Scalars['ID']>;
};


export type QueryTeamArgs = {
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  play?: Maybe<Scalars['Boolean']>;
  createNewDebugGame?: Maybe<Scalars['Boolean']>;
  registerUser?: Maybe<LoginResult>;
  login?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']>;
  createTournament?: Maybe<Tournament>;
};


export type MutationPlayArgs = {
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
  action: Scalars['String'];
  data: Scalars['JSON'];
};


export type MutationCreateNewDebugGameArgs = {
  tournamentID: Scalars['ID'];
  userID: Scalars['ID'];
};


export type MutationRegisterUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateTournamentArgs = {
  name: Scalars['String'];
};

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = (
  { __typename?: 'Query' }
  & { authenticatedUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export type CreateNewDebugGameMutationVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type CreateNewDebugGameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createNewDebugGame'>
);

export type DebugArenaSubscriptionVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type DebugArenaSubscription = (
  { __typename?: 'Subscription' }
  & { debugArena?: Maybe<(
    { __typename?: 'DebugArena' }
    & Pick<DebugArena, 'id' | 'game'>
  )> }
);

export type GameCancelFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'version' | 'canceled'>
);

export type GameFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'id' | 'version' | 'canceled' | 'gameState'>
  & { players?: Maybe<Array<Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'token' | 'connected'>
  )>>> }
);

export type GamePatchFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'version' | 'gameState'>
);

export type GamePlayersFragment = (
  { __typename?: 'Game' }
  & { players?: Maybe<Array<Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'token' | 'connected'>
  )>>> }
);

export type GameSubscriptionVariables = Exact<{
  gameID: Scalars['ID'];
}>;


export type GameSubscription = (
  { __typename?: 'Subscription' }
  & { game?: Maybe<(
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'canceled' | 'version' | 'gameState'>
    & { players?: Maybe<Array<Maybe<(
      { __typename?: 'Player' }
      & Pick<Player, 'id' | 'token' | 'connected'>
    )>>> }
  ) | (
    { __typename?: 'GamePatch' }
    & Pick<GamePatch, 'gameID' | 'version' | 'patch'>
  ) | (
    { __typename?: 'GameCanceled' }
    & Pick<GameCanceled, 'version'>
  ) | (
    { __typename?: 'PlayerConnection' }
    & Pick<PlayerConnection, 'playerID' | 'connected'>
  )> }
);

export type GetTeamQueryVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type GetTeamQuery = (
  { __typename?: 'Query' }
  & { team?: Maybe<(
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
    & { members?: Maybe<Array<Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>>> }
  ) | (
    { __typename?: 'UserNotPartOfAnyTeam' }
    & Pick<UserNotPartOfAnyTeam, 'message'>
  )> }
);

export type PlayMutationVariables = Exact<{
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
  action: Scalars['String'];
  data: Scalars['JSON'];
}>;


export type PlayMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'play'>
);

export const GameCancelFragmentDoc = gql`
    fragment GameCancel on Game {
  version
  canceled
}
    `;
export const GameFragmentDoc = gql`
    fragment Game on Game {
  id
  version
  canceled
  players {
    id
    token
    connected
  }
  gameState
}
    `;
export const GamePatchFragmentDoc = gql`
    fragment GamePatch on Game {
  version
  gameState
}
    `;
export const GamePlayersFragmentDoc = gql`
    fragment GamePlayers on Game {
  players {
    id
    token
    connected
  }
}
    `;
export const GetAuthenticatedUserDocument = gql`
    query getAuthenticatedUser {
  authenticatedUser {
    id
    username
  }
}
    `;

/**
 * __useGetAuthenticatedUserQuery__
 *
 * To run a query within a React component, call `useGetAuthenticatedUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthenticatedUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthenticatedUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuthenticatedUserQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>(GetAuthenticatedUserDocument, options);
      }
export function useGetAuthenticatedUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>(GetAuthenticatedUserDocument, options);
        }
export type GetAuthenticatedUserQueryHookResult = ReturnType<typeof useGetAuthenticatedUserQuery>;
export type GetAuthenticatedUserLazyQueryHookResult = ReturnType<typeof useGetAuthenticatedUserLazyQuery>;
export type GetAuthenticatedUserQueryResult = Apollo.QueryResult<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>;
export const CreateNewDebugGameDocument = gql`
    mutation CreateNewDebugGame($userID: ID!, $tournamentID: ID!) {
  createNewDebugGame(userID: $userID, tournamentID: $tournamentID)
}
    `;
export type CreateNewDebugGameMutationFn = Apollo.MutationFunction<CreateNewDebugGameMutation, CreateNewDebugGameMutationVariables>;

/**
 * __useCreateNewDebugGameMutation__
 *
 * To run a mutation, you first call `useCreateNewDebugGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewDebugGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewDebugGameMutation, { data, loading, error }] = useCreateNewDebugGameMutation({
 *   variables: {
 *      userID: // value for 'userID'
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useCreateNewDebugGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewDebugGameMutation, CreateNewDebugGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewDebugGameMutation, CreateNewDebugGameMutationVariables>(CreateNewDebugGameDocument, options);
      }
export type CreateNewDebugGameMutationHookResult = ReturnType<typeof useCreateNewDebugGameMutation>;
export type CreateNewDebugGameMutationResult = Apollo.MutationResult<CreateNewDebugGameMutation>;
export type CreateNewDebugGameMutationOptions = Apollo.BaseMutationOptions<CreateNewDebugGameMutation, CreateNewDebugGameMutationVariables>;
export const DebugArenaDocument = gql`
    subscription debugArena($userID: ID!, $tournamentID: ID!) {
  debugArena(userID: $userID, tournamentID: $tournamentID) {
    id
    game
  }
}
    `;

/**
 * __useDebugArenaSubscription__
 *
 * To run a query within a React component, call `useDebugArenaSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDebugArenaSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebugArenaSubscription({
 *   variables: {
 *      userID: // value for 'userID'
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useDebugArenaSubscription(baseOptions: Apollo.SubscriptionHookOptions<DebugArenaSubscription, DebugArenaSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DebugArenaSubscription, DebugArenaSubscriptionVariables>(DebugArenaDocument, options);
      }
export type DebugArenaSubscriptionHookResult = ReturnType<typeof useDebugArenaSubscription>;
export type DebugArenaSubscriptionResult = Apollo.SubscriptionResult<DebugArenaSubscription>;
export const GameDocument = gql`
    subscription game($gameID: ID!) {
  game(gameID: $gameID) {
    ... on GamePatch {
      gameID
      version
      patch
    }
    ... on Game {
      id
      canceled
      version
      players {
        id
        token
        connected
      }
      gameState
    }
    ... on GameCanceled {
      version
    }
    ... on PlayerConnection {
      playerID
      connected
    }
  }
}
    `;

/**
 * __useGameSubscription__
 *
 * To run a query within a React component, call `useGameSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameSubscription({
 *   variables: {
 *      gameID: // value for 'gameID'
 *   },
 * });
 */
export function useGameSubscription(baseOptions: Apollo.SubscriptionHookOptions<GameSubscription, GameSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GameSubscription, GameSubscriptionVariables>(GameDocument, options);
      }
export type GameSubscriptionHookResult = ReturnType<typeof useGameSubscription>;
export type GameSubscriptionResult = Apollo.SubscriptionResult<GameSubscription>;
export const GetTeamDocument = gql`
    query GetTeam($userID: ID!, $tournamentID: ID!) {
  team(userID: $userID, tournamentID: $tournamentID) {
    ... on Team {
      id
      name
      members {
        id
        username
      }
    }
    ... on UserNotPartOfAnyTeam {
      message
    }
  }
}
    `;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      userID: // value for 'userID'
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const PlayDocument = gql`
    mutation Play($gameID: ID!, $playerID: ID!, $action: String!, $data: JSON!) {
  play(gameID: $gameID, playerID: $playerID, action: $action, data: $data)
}
    `;
export type PlayMutationFn = Apollo.MutationFunction<PlayMutation, PlayMutationVariables>;

/**
 * __usePlayMutation__
 *
 * To run a mutation, you first call `usePlayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playMutation, { data, loading, error }] = usePlayMutation({
 *   variables: {
 *      gameID: // value for 'gameID'
 *      playerID: // value for 'playerID'
 *      action: // value for 'action'
 *      data: // value for 'data'
 *   },
 * });
 */
export function usePlayMutation(baseOptions?: Apollo.MutationHookOptions<PlayMutation, PlayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlayMutation, PlayMutationVariables>(PlayDocument, options);
      }
export type PlayMutationHookResult = ReturnType<typeof usePlayMutation>;
export type PlayMutationResult = Apollo.MutationResult<PlayMutation>;
export type PlayMutationOptions = Apollo.BaseMutationOptions<PlayMutation, PlayMutationVariables>;