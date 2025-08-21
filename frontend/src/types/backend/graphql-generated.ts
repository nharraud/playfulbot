import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Arena = {
  __typename?: 'Arena';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  team?: Maybe<Team>;
};

export type ArenaGamesError = ArenaNotFoundError | ForbiddenError;

export type ArenaGamesFailure = {
  __typename?: 'ArenaGamesFailure';
  errors: Array<ArenaGamesError>;
};

export type ArenaGamesResult = ArenaGamesFailure | GameRef;

export type ArenaNameAlreadyTakenError = Error & {
  __typename?: 'ArenaNameAlreadyTakenError';
  message: Scalars['String']['output'];
};

export type ArenaNotFoundError = Error & {
  __typename?: 'ArenaNotFoundError';
  arenaID?: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
};

export type CreateArenaError = ArenaNameAlreadyTakenError | ForbiddenError | MaxArenaReachedError | ValidationError;

export type CreateArenaFailure = {
  __typename?: 'CreateArenaFailure';
  errors: Array<CreateArenaError>;
};

export type CreateArenaGameError = ArenaNotFoundError | ForbiddenError;

export type CreateArenaGameFailure = {
  __typename?: 'CreateArenaGameFailure';
  errors: Array<CreateArenaGameError>;
};

export type CreateArenaGameResult = CreateArenaGameFailure | CreateArenaGameSuccess;

export type CreateArenaGameSuccess = {
  __typename?: 'CreateArenaGameSuccess';
  gameID: Scalars['String']['output'];
};

export type CreateArenaResult = CreateArenaFailure | CreateArenaSuccess;

export type CreateArenaSuccess = {
  __typename?: 'CreateArenaSuccess';
  arena?: Maybe<Arena>;
};

export type CreateTeamError = ForbiddenError | TeamNameAlreadyTakenError | ValidationError;

export type CreateTeamFailure = {
  __typename?: 'CreateTeamFailure';
  errors: Array<CreateTeamError>;
};

export type CreateTeamResult = CreateTeamFailure | CreateTeamSuccess;

export type CreateTeamSuccess = {
  __typename?: 'CreateTeamSuccess';
  team?: Maybe<Team>;
};

export type DeletedTeam = {
  __typename?: 'DeletedTeam';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Error = {
  message: Scalars['String']['output'];
};

export type ForbiddenError = Error & {
  __typename?: 'ForbiddenError';
  message: Scalars['String']['output'];
};

export type GameRef = {
  __typename?: 'GameRef';
  gameID: Scalars['String']['output'];
  graphqlUrl: Scalars['String']['output'];
};

export type JoinTeamError = ForbiddenError | TeamNotFoundError;

export type JoinTeamFailure = {
  __typename?: 'JoinTeamFailure';
  errors: Array<JoinTeamError>;
};

export type JoinTeamResult = JoinTeamFailure | JoinTeamSuccess;

export type JoinTeamSuccess = {
  __typename?: 'JoinTeamSuccess';
  newTeam?: Maybe<Team>;
  oldTeam?: Maybe<TeamOrDeletedTeam>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String']['output'];
  user: User;
};

export type MaxArenaReachedError = Error & {
  __typename?: 'MaxArenaReachedError';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createArena?: Maybe<CreateArenaResult>;
  createArenaGame?: Maybe<CreateArenaGameResult>;
  createTeam?: Maybe<CreateTeamResult>;
  createTournament?: Maybe<Tournament>;
  joinTeam?: Maybe<JoinTeamResult>;
  login?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  registerUser?: Maybe<UserRegistrationResult>;
  updateTeam?: Maybe<UpdateTeamResult>;
};


export type MutationCreateArenaArgs = {
  name: Scalars['String']['input'];
  teamID: Scalars['ID']['input'];
};


export type MutationCreateArenaGameArgs = {
  arenaID: Scalars['ID']['input'];
};


export type MutationCreateTeamArgs = {
  input: TeamInput;
  join?: Scalars['Boolean']['input'];
  tournamentID: Scalars['ID']['input'];
};


export type MutationCreateTournamentArgs = {
  lastRoundDate: Scalars['Date']['input'];
  minutesBetweenRounds: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  roundsNumber: Scalars['Int']['input'];
  startDate: Scalars['Date']['input'];
};


export type MutationJoinTeamArgs = {
  teamID: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateTeamArgs = {
  input: TeamInput;
  teamID: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  authenticatedUser?: Maybe<User>;
  team?: Maybe<UserTeamResult>;
  tournament?: Maybe<Tournament>;
};


export type QueryTeamArgs = {
  tournamentID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type QueryTournamentArgs = {
  tournamentID: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  arenaGames?: Maybe<ArenaGamesResult>;
};


export type SubscriptionArenaGamesArgs = {
  arenaID: Scalars['ID']['input'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID']['output'];
  members?: Maybe<Array<Maybe<User>>>;
  name: Scalars['String']['output'];
  tournament?: Maybe<Tournament>;
};

export type TeamInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TeamNameAlreadyTakenError = Error & {
  __typename?: 'TeamNameAlreadyTakenError';
  message: Scalars['String']['output'];
};

export type TeamNotFoundError = Error & {
  __typename?: 'TeamNotFoundError';
  message: Scalars['String']['output'];
  teamID?: Maybe<Scalars['ID']['output']>;
};

export type TeamOrDeletedTeam = DeletedTeam | Team;

export type Tournament = {
  __typename?: 'Tournament';
  id: Scalars['ID']['output'];
  myRole?: Maybe<TournamentRole>;
  name: Scalars['String']['output'];
  status?: Maybe<TournamentStatus>;
};

export type TournamentInvitation = {
  __typename?: 'TournamentInvitation';
  invitee?: Maybe<User>;
  sentAt?: Maybe<Scalars['Date']['output']>;
  tournament?: Maybe<Tournament>;
};

export enum TournamentRole {
  Organizer = 'ORGANIZER'
}

export enum TournamentStatus {
  Created = 'CREATED',
  Ended = 'ENDED',
  Started = 'STARTED'
}

export type UpdateTeamError = ForbiddenError | TeamNameAlreadyTakenError | ValidationError;

export type UpdateTeamFailure = {
  __typename?: 'UpdateTeamFailure';
  errors: Array<UpdateTeamError>;
};

export type UpdateTeamResult = UpdateTeamFailure | UpdateTeamSuccess;

export type UpdateTeamSuccess = {
  __typename?: 'UpdateTeamSuccess';
  team?: Maybe<Team>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  organizedTournaments?: Maybe<Array<Tournament>>;
  teams?: Maybe<Array<Maybe<Team>>>;
  tournamentInvitations?: Maybe<Array<TournamentInvitation>>;
  username: Scalars['String']['output'];
};

export type UserNotPartOfAnyTeam = {
  __typename?: 'UserNotPartOfAnyTeam';
  message: Scalars['String']['output'];
};

export type UserRegistrationResult = LoginResult | UsernameAlreadyTaken | ValidationError;

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type UsernameAlreadyTaken = Error & {
  __typename?: 'UsernameAlreadyTaken';
  message: Scalars['String']['output'];
};

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  message: Scalars['String']['output'];
};

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = { __typename?: 'Query', authenticatedUser?: { __typename?: 'User', id: string, username: string } | null };

export type AuthenticatedUserTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticatedUserTournamentsQuery = { __typename?: 'Query', authenticatedUser?: { __typename?: 'User', id: string, username: string, teams?: Array<{ __typename?: 'Team', id: string, name: string, tournament?: { __typename?: 'Tournament', id: string, name: string, status?: TournamentStatus | null } | null } | null> | null, tournamentInvitations?: Array<{ __typename?: 'TournamentInvitation', tournament?: { __typename?: 'Tournament', id: string, name: string, status?: TournamentStatus | null } | null }> | null, organizedTournaments?: Array<{ __typename?: 'Tournament', id: string, name: string, status?: TournamentStatus | null }> | null } | null };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResult', token: string, user: { __typename?: 'User', id: string, username: string } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };


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
export function useGetAuthenticatedUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>(GetAuthenticatedUserDocument, options);
        }
export type GetAuthenticatedUserQueryHookResult = ReturnType<typeof useGetAuthenticatedUserQuery>;
export type GetAuthenticatedUserLazyQueryHookResult = ReturnType<typeof useGetAuthenticatedUserLazyQuery>;
export type GetAuthenticatedUserSuspenseQueryHookResult = ReturnType<typeof useGetAuthenticatedUserSuspenseQuery>;
export type GetAuthenticatedUserQueryResult = Apollo.QueryResult<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>;
export const AuthenticatedUserTournamentsDocument = gql`
    query authenticatedUserTournaments {
  authenticatedUser {
    id
    username
    teams {
      id
      name
      tournament {
        id
        name
        status
      }
    }
    tournamentInvitations {
      tournament {
        id
        name
        status
      }
    }
    organizedTournaments {
      id
      name
      status
    }
  }
}
    `;

/**
 * __useAuthenticatedUserTournamentsQuery__
 *
 * To run a query within a React component, call `useAuthenticatedUserTournamentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthenticatedUserTournamentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthenticatedUserTournamentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthenticatedUserTournamentsQuery(baseOptions?: Apollo.QueryHookOptions<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>(AuthenticatedUserTournamentsDocument, options);
      }
export function useAuthenticatedUserTournamentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>(AuthenticatedUserTournamentsDocument, options);
        }
export function useAuthenticatedUserTournamentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>(AuthenticatedUserTournamentsDocument, options);
        }
export type AuthenticatedUserTournamentsQueryHookResult = ReturnType<typeof useAuthenticatedUserTournamentsQuery>;
export type AuthenticatedUserTournamentsLazyQueryHookResult = ReturnType<typeof useAuthenticatedUserTournamentsLazyQuery>;
export type AuthenticatedUserTournamentsSuspenseQueryHookResult = ReturnType<typeof useAuthenticatedUserTournamentsSuspenseQuery>;
export type AuthenticatedUserTournamentsQueryResult = Apollo.QueryResult<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>;
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