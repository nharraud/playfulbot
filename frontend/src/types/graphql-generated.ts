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
  Date: any;
  JSON: any;
};



export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
};

export enum TournamentStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED'
}

export type Tournament = {
  __typename?: 'Tournament';
  id: Scalars['ID'];
  name: Scalars['String'];
  status?: Maybe<TournamentStatus>;
  startDate?: Maybe<Scalars['Date']>;
  lastRoundDate?: Maybe<Scalars['Date']>;
  firstRoundDate?: Maybe<Scalars['Date']>;
  roundsNumber?: Maybe<Scalars['Int']>;
  minutesBetweenRounds?: Maybe<Scalars['Int']>;
  rounds?: Maybe<Array<Maybe<Round>>>;
};


export type TournamentRoundsArgs = {
  maxSize?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Date']>;
  after?: Maybe<Scalars['Date']>;
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
  initialState?: Maybe<Scalars['JSON']>;
  patches?: Maybe<Scalars['JSON']>;
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

export type LivePlayer = Player | PlayerConnection;

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

export enum RoundStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED'
}

export type Round = {
  __typename?: 'Round';
  id?: Maybe<Scalars['ID']>;
  status?: Maybe<RoundStatus>;
  startDate?: Maybe<Scalars['Date']>;
  teamPoints?: Maybe<Scalars['Int']>;
  teamGames?: Maybe<Array<Maybe<GameSummary>>>;
};


export type RoundTeamGamesArgs = {
  teamID?: Maybe<Scalars['ID']>;
};

export type GameSummary = {
  __typename?: 'GameSummary';
  id?: Maybe<Scalars['ID']>;
  losers?: Maybe<Array<Maybe<Team>>>;
  winners?: Maybe<Array<Maybe<Team>>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  game?: Maybe<LiveGame>;
  debugArena?: Maybe<DebugArena>;
  playerGames?: Maybe<LivePlayerGames>;
  teamPlayer?: Maybe<LivePlayer>;
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


export type SubscriptionTeamPlayerArgs = {
  teamID: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  tournament?: Maybe<Tournament>;
  round?: Maybe<Round>;
  team?: Maybe<UserTeamResult>;
  authenticatedUser?: Maybe<User>;
};


export type QueryTournamentArgs = {
  tournamentID?: Maybe<Scalars['ID']>;
};


export type QueryRoundArgs = {
  roundID?: Maybe<Scalars['ID']>;
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
  startDate: Scalars['Date'];
  lastRoundDate: Scalars['Date'];
  roundsNumber: Scalars['Int'];
  minutesBetweenRounds: Scalars['Int'];
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
  & Pick<Game, 'id' | 'version' | 'canceled' | 'initialState' | 'patches'>
  & { players?: Maybe<Array<Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'token' | 'connected'>
  )>>> }
);

export type GamePatchFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'version' | 'initialState' | 'patches'>
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
    & Pick<Game, 'id' | 'canceled' | 'version' | 'initialState' | 'patches'>
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

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
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

export type PlayerConnectedFragment = (
  { __typename?: 'Player' }
  & Pick<Player, 'connected'>
);

export type PlayerFragment = (
  { __typename?: 'Player' }
  & Pick<Player, 'id' | 'token' | 'connected'>
);

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type RoundSummaryQueryVariables = Exact<{
  roundID: Scalars['ID'];
  teamID: Scalars['ID'];
}>;


export type RoundSummaryQuery = (
  { __typename?: 'Query' }
  & { round?: Maybe<(
    { __typename?: 'Round' }
    & Pick<Round, 'id' | 'status' | 'startDate' | 'teamPoints'>
    & { teamGames?: Maybe<Array<Maybe<(
      { __typename?: 'GameSummary' }
      & Pick<GameSummary, 'id'>
      & { losers?: Maybe<Array<Maybe<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>>>, winners?: Maybe<Array<Maybe<(
        { __typename?: 'Team' }
        & Pick<Team, 'id' | 'name'>
      )>>> }
    )>>> }
  )> }
);

export type TeamPlayerSubscriptionVariables = Exact<{
  teamID: Scalars['ID'];
}>;


export type TeamPlayerSubscription = (
  { __typename?: 'Subscription' }
  & { teamPlayer?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'token' | 'connected'>
  ) | (
    { __typename?: 'PlayerConnection' }
    & Pick<PlayerConnection, 'playerID' | 'connected'>
  )> }
);

export type TournamentRoundsQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
  maxSize: Scalars['Int'];
  before?: Maybe<Scalars['Date']>;
  after?: Maybe<Scalars['Date']>;
}>;


export type TournamentRoundsQuery = (
  { __typename?: 'Query' }
  & { tournament?: Maybe<(
    { __typename?: 'Tournament' }
    & Pick<Tournament, 'id' | 'startDate' | 'lastRoundDate' | 'firstRoundDate' | 'roundsNumber' | 'minutesBetweenRounds'>
    & { rounds?: Maybe<Array<Maybe<(
      { __typename?: 'Round' }
      & Pick<Round, 'id' | 'status' | 'startDate' | 'teamPoints'>
    )>>> }
  )> }
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
  initialState
  patches
}
    `;
export const GamePatchFragmentDoc = gql`
    fragment GamePatch on Game {
  version
  initialState
  patches
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
export const PlayerConnectedFragmentDoc = gql`
    fragment PlayerConnected on Player {
  connected
}
    `;
export const PlayerFragmentDoc = gql`
    fragment Player on Player {
  id
  token
  connected
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
      initialState
      patches
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
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      id
      username
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
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
export const RegisterUserDocument = gql`
    mutation registerUser($username: String!, $password: String!) {
  registerUser(username: $username, password: $password) {
    user {
      id
      username
    }
    token
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const RoundSummaryDocument = gql`
    query RoundSummary($roundID: ID!, $teamID: ID!) {
  round(roundID: $roundID) {
    id
    status
    startDate
    teamPoints
    teamGames(teamID: $teamID) {
      id
      losers {
        id
        name
      }
      winners {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useRoundSummaryQuery__
 *
 * To run a query within a React component, call `useRoundSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoundSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoundSummaryQuery({
 *   variables: {
 *      roundID: // value for 'roundID'
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useRoundSummaryQuery(baseOptions: Apollo.QueryHookOptions<RoundSummaryQuery, RoundSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoundSummaryQuery, RoundSummaryQueryVariables>(RoundSummaryDocument, options);
      }
export function useRoundSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoundSummaryQuery, RoundSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoundSummaryQuery, RoundSummaryQueryVariables>(RoundSummaryDocument, options);
        }
export type RoundSummaryQueryHookResult = ReturnType<typeof useRoundSummaryQuery>;
export type RoundSummaryLazyQueryHookResult = ReturnType<typeof useRoundSummaryLazyQuery>;
export type RoundSummaryQueryResult = Apollo.QueryResult<RoundSummaryQuery, RoundSummaryQueryVariables>;
export const TeamPlayerDocument = gql`
    subscription teamPlayer($teamID: ID!) {
  teamPlayer(teamID: $teamID) {
    ... on Player {
      id
      token
      connected
    }
    ... on PlayerConnection {
      playerID
      connected
    }
  }
}
    `;

/**
 * __useTeamPlayerSubscription__
 *
 * To run a query within a React component, call `useTeamPlayerSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTeamPlayerSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamPlayerSubscription({
 *   variables: {
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useTeamPlayerSubscription(baseOptions: Apollo.SubscriptionHookOptions<TeamPlayerSubscription, TeamPlayerSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TeamPlayerSubscription, TeamPlayerSubscriptionVariables>(TeamPlayerDocument, options);
      }
export type TeamPlayerSubscriptionHookResult = ReturnType<typeof useTeamPlayerSubscription>;
export type TeamPlayerSubscriptionResult = Apollo.SubscriptionResult<TeamPlayerSubscription>;
export const TournamentRoundsDocument = gql`
    query tournamentRounds($tournamentID: ID!, $maxSize: Int!, $before: Date, $after: Date) {
  tournament(tournamentID: $tournamentID) {
    id
    startDate
    lastRoundDate
    firstRoundDate
    roundsNumber
    minutesBetweenRounds
    rounds(maxSize: $maxSize, before: $before, after: $after) {
      id
      status
      startDate
      teamPoints
    }
  }
}
    `;

/**
 * __useTournamentRoundsQuery__
 *
 * To run a query within a React component, call `useTournamentRoundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentRoundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentRoundsQuery({
 *   variables: {
 *      tournamentID: // value for 'tournamentID'
 *      maxSize: // value for 'maxSize'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTournamentRoundsQuery(baseOptions: Apollo.QueryHookOptions<TournamentRoundsQuery, TournamentRoundsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TournamentRoundsQuery, TournamentRoundsQueryVariables>(TournamentRoundsDocument, options);
      }
export function useTournamentRoundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TournamentRoundsQuery, TournamentRoundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TournamentRoundsQuery, TournamentRoundsQueryVariables>(TournamentRoundsDocument, options);
        }
export type TournamentRoundsQueryHookResult = ReturnType<typeof useTournamentRoundsQuery>;
export type TournamentRoundsLazyQueryHookResult = ReturnType<typeof useTournamentRoundsLazyQuery>;
export type TournamentRoundsQueryResult = Apollo.QueryResult<TournamentRoundsQuery, TournamentRoundsQueryVariables>;