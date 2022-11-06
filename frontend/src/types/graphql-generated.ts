import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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

export type AlreadyInATeamError = Error & {
  __typename?: 'AlreadyInATeamError';
  message: Scalars['String'];
};

export type CreateTeamError = ForbiddenError | ValidationError;

export type CreateTeamFailure = {
  __typename?: 'CreateTeamFailure';
  errors: Array<CreateTeamError>;
};

export type CreateTeamResult = CreateTeamFailure | CreateTeamSuccess;

export type CreateTeamSuccess = {
  __typename?: 'CreateTeamSuccess';
  team?: Maybe<Team>;
};

export type DebugArena = {
  __typename?: 'DebugArena';
  game?: Maybe<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
};

export type DeletedTeam = {
  __typename?: 'DeletedTeam';
  name?: Maybe<Scalars['String']>;
  teamID?: Maybe<Scalars['ID']>;
};

export type Error = {
  message: Scalars['String'];
};

export type ForbiddenError = Error & {
  __typename?: 'ForbiddenError';
  message: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  canceled?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  initialState?: Maybe<Scalars['JSON']>;
  patches?: Maybe<Scalars['JSON']>;
  players?: Maybe<Array<Maybe<Player>>>;
  version?: Maybe<Scalars['Int']>;
  winners?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type GameCanceled = {
  __typename?: 'GameCanceled';
  gameID?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
};

export type GamePatch = {
  __typename?: 'GamePatch';
  gameID?: Maybe<Scalars['ID']>;
  patch?: Maybe<Scalars['JSON']>;
  version?: Maybe<Scalars['Int']>;
  winners?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type GameSummary = {
  __typename?: 'GameSummary';
  id?: Maybe<Scalars['ID']>;
  losers?: Maybe<Array<Maybe<Team>>>;
  winners?: Maybe<Array<Maybe<Team>>>;
};

export type JoinTeamError = TeamNotFoundError;

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

export type LiveGame = Game | GameCanceled | GamePatch | PlayerConnection;

export type LivePlayer = Player | PlayerConnection;

export type LivePlayerGames = NewPlayerGames | PlayerGames;

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNewDebugGame?: Maybe<Scalars['Boolean']>;
  createTeam?: Maybe<CreateTeamResult>;
  createTournament?: Maybe<Tournament>;
  joinTeam?: Maybe<JoinTeamResult>;
  login?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']>;
  play?: Maybe<Scalars['Boolean']>;
  registerTournamentInvitationLink?: Maybe<RegisterTournamentInvitationResult>;
  registerUser?: Maybe<LoginResult>;
  updateTeam?: Maybe<UpdateTeamResult>;
};


export type MutationCreateNewDebugGameArgs = {
  tournamentID: Scalars['ID'];
  userID: Scalars['ID'];
};


export type MutationCreateTeamArgs = {
  input: TeamInput;
  join?: Scalars['Boolean'];
  tournamentID: Scalars['ID'];
};


export type MutationCreateTournamentArgs = {
  lastRoundDate: Scalars['Date'];
  minutesBetweenRounds: Scalars['Int'];
  name: Scalars['String'];
  roundsNumber: Scalars['Int'];
  startDate: Scalars['Date'];
};


export type MutationJoinTeamArgs = {
  teamID: Scalars['ID'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationPlayArgs = {
  data: Scalars['JSON'];
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
};


export type MutationRegisterTournamentInvitationLinkArgs = {
  tournamentInvitationLinkID: Scalars['ID'];
};


export type MutationRegisterUserArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateTeamArgs = {
  input: TeamInput;
  teamID: Scalars['ID'];
};

export type NewPlayerGames = {
  __typename?: 'NewPlayerGames';
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type Player = {
  __typename?: 'Player';
  connected?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  connected?: Maybe<Scalars['Boolean']>;
  playerID?: Maybe<Scalars['ID']>;
};

export type PlayerGames = {
  __typename?: 'PlayerGames';
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
  playerID?: Maybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedUser?: Maybe<User>;
  round?: Maybe<Round>;
  team?: Maybe<UserTeamResult>;
  tournament?: Maybe<Tournament>;
  tournamentByInvitationLink?: Maybe<Tournament>;
};


export type QueryRoundArgs = {
  roundID?: InputMaybe<Scalars['ID']>;
};


export type QueryTeamArgs = {
  tournamentID: Scalars['ID'];
  userID: Scalars['ID'];
};


export type QueryTournamentArgs = {
  tournamentID?: InputMaybe<Scalars['ID']>;
};


export type QueryTournamentByInvitationLinkArgs = {
  tournamentInvitationLinkID: Scalars['ID'];
};

export type RegisterTournamentInvitationError = AlreadyInATeamError | TournamentInvitationLinkNotFoundError;

export type RegisterTournamentInvitationFailure = {
  __typename?: 'RegisterTournamentInvitationFailure';
  errors: Array<RegisterTournamentInvitationError>;
};

export type RegisterTournamentInvitationResult = RegisterTournamentInvitationFailure | RegisterTournamentInvitationSuccess;

export type RegisterTournamentInvitationSuccess = {
  __typename?: 'RegisterTournamentInvitationSuccess';
  invitation?: Maybe<TournamentInvitation>;
};

export type Round = {
  __typename?: 'Round';
  id?: Maybe<Scalars['ID']>;
  startDate?: Maybe<Scalars['Date']>;
  status?: Maybe<RoundStatus>;
  teamGames?: Maybe<Array<Maybe<GameSummary>>>;
  teamPoints?: Maybe<Scalars['Int']>;
};


export type RoundTeamGamesArgs = {
  teamID?: InputMaybe<Scalars['ID']>;
};

export enum RoundStatus {
  Created = 'CREATED',
  Ended = 'ENDED',
  Started = 'STARTED'
}

export type Subscription = {
  __typename?: 'Subscription';
  debugArena?: Maybe<DebugArena>;
  game?: Maybe<LiveGame>;
  playerGames?: Maybe<LivePlayerGames>;
  teamPlayer?: Maybe<LivePlayer>;
};


export type SubscriptionDebugArenaArgs = {
  tournamentID: Scalars['ID'];
  userID: Scalars['ID'];
};


export type SubscriptionGameArgs = {
  gameID: Scalars['ID'];
};


export type SubscriptionPlayerGamesArgs = {
  playerID: Scalars['ID'];
};


export type SubscriptionTeamPlayerArgs = {
  teamID: Scalars['ID'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  members?: Maybe<Array<Maybe<User>>>;
  name: Scalars['String'];
  tournament?: Maybe<Tournament>;
};

export type TeamInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type TeamNotFoundError = Error & {
  __typename?: 'TeamNotFoundError';
  message: Scalars['String'];
  teamID?: Maybe<Scalars['ID']>;
};

export type TeamOrDeletedTeam = DeletedTeam | Team;

export type Tournament = {
  __typename?: 'Tournament';
  firstRoundDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  invitationLinkID?: Maybe<Scalars['ID']>;
  lastRoundDate?: Maybe<Scalars['Date']>;
  minutesBetweenRounds?: Maybe<Scalars['Int']>;
  myRole?: Maybe<TournamentRoleName>;
  name: Scalars['String'];
  rounds?: Maybe<Array<Maybe<Round>>>;
  roundsNumber?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['Date']>;
  status?: Maybe<TournamentStatus>;
  teams?: Maybe<Array<Maybe<Team>>>;
};


export type TournamentRoundsArgs = {
  after?: InputMaybe<Scalars['Date']>;
  before?: InputMaybe<Scalars['Date']>;
  maxSize?: InputMaybe<Scalars['Int']>;
};

export type TournamentInvitation = {
  __typename?: 'TournamentInvitation';
  id?: Maybe<Scalars['ID']>;
  invitee?: Maybe<User>;
  tournament?: Maybe<Tournament>;
};

export type TournamentInvitationLinkNotFoundError = Error & {
  __typename?: 'TournamentInvitationLinkNotFoundError';
  message: Scalars['String'];
};

export enum TournamentRoleName {
  Admin = 'ADMIN'
}

export enum TournamentStatus {
  Created = 'CREATED',
  Ended = 'ENDED',
  Started = 'STARTED'
}

export type UpdateTeamError = ForbiddenError | ValidationError;

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
  id: Scalars['ID'];
  organizedTournaments?: Maybe<Array<Tournament>>;
  teams?: Maybe<Array<Maybe<Team>>>;
  tournamentInvitations?: Maybe<Array<TournamentInvitation>>;
  username: Scalars['String'];
};

export type UserNotPartOfAnyTeam = {
  __typename?: 'UserNotPartOfAnyTeam';
  message: Scalars['String'];
};

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  message: Scalars['String'];
};

export type CreateTeamMutationVariables = Exact<{
  tournamentID: Scalars['ID'];
  input: TeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam?: { __typename?: 'CreateTeamFailure', errors: Array<{ __typename?: 'ForbiddenError', message: string } | { __typename?: 'ValidationError', message: string }> } | { __typename?: 'CreateTeamSuccess', team?: { __typename?: 'Team', id: string, name: string } | null } | null };

export type UpdateTeamMutationVariables = Exact<{
  teamID: Scalars['ID'];
  input: TeamInput;
}>;


export type UpdateTeamMutation = { __typename?: 'Mutation', updateTeam?: { __typename?: 'UpdateTeamFailure', errors: Array<{ __typename?: 'ForbiddenError', message: string } | { __typename?: 'ValidationError', message: string }> } | { __typename?: 'UpdateTeamSuccess', team?: { __typename?: 'Team', id: string, name: string } | null } | null };

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = { __typename?: 'Query', authenticatedUser?: { __typename?: 'User', id: string, username: string } | null };

export type AuthenticatedUserTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticatedUserTournamentsQuery = { __typename?: 'Query', authenticatedUser?: { __typename?: 'User', id: string, username: string, teams?: Array<{ __typename?: 'Team', id: string, name: string, tournament?: { __typename?: 'Tournament', id: string, name: string, lastRoundDate?: any | null, status?: TournamentStatus | null } | null } | null> | null, tournamentInvitations?: Array<{ __typename?: 'TournamentInvitation', id?: string | null, tournament?: { __typename?: 'Tournament', id: string, name: string, lastRoundDate?: any | null, status?: TournamentStatus | null } | null }> | null, organizedTournaments?: Array<{ __typename?: 'Tournament', id: string, name: string, lastRoundDate?: any | null, status?: TournamentStatus | null }> | null } | null };

export type CreateNewDebugGameMutationVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type CreateNewDebugGameMutation = { __typename?: 'Mutation', createNewDebugGame?: boolean | null };

export type CreateTournamentMutationVariables = Exact<{
  name: Scalars['String'];
  startDate: Scalars['Date'];
  lastRoundDate: Scalars['Date'];
  roundsNumber: Scalars['Int'];
  minutesBetweenRounds: Scalars['Int'];
}>;


export type CreateTournamentMutation = { __typename?: 'Mutation', createTournament?: { __typename?: 'Tournament', id: string, name: string } | null };

export type DebugArenaSubscriptionVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type DebugArenaSubscription = { __typename?: 'Subscription', debugArena?: { __typename?: 'DebugArena', id?: string | null, game?: string | null } | null };

export type GameCancelFragment = { __typename?: 'Game', version?: number | null, canceled?: boolean | null };

export type GameFragment = { __typename?: 'Game', id?: string | null, version?: number | null, canceled?: boolean | null, winners?: Array<number | null> | null, initialState?: any | null, patches?: any | null, players?: Array<{ __typename?: 'Player', id?: string | null, token?: string | null, connected?: boolean | null } | null> | null };

export type GamePatchFragment = { __typename?: 'Game', version?: number | null, initialState?: any | null, patches?: any | null, winners?: Array<number | null> | null };

export type GamePlayersFragment = { __typename?: 'Game', players?: Array<{ __typename?: 'Player', id?: string | null, token?: string | null, connected?: boolean | null } | null> | null };

export type GameSubscriptionVariables = Exact<{
  gameID: Scalars['ID'];
}>;


export type GameSubscription = { __typename?: 'Subscription', game?: { __typename?: 'Game', id?: string | null, canceled?: boolean | null, version?: number | null, winners?: Array<number | null> | null, initialState?: any | null, patches?: any | null, players?: Array<{ __typename?: 'Player', id?: string | null, token?: string | null, connected?: boolean | null } | null> | null } | { __typename?: 'GameCanceled', gameID?: string | null, version?: number | null } | { __typename?: 'GamePatch', gameID?: string | null, version?: number | null, patch?: any | null, winners?: Array<number | null> | null } | { __typename?: 'PlayerConnection', playerID?: string | null, connected?: boolean | null } | null };

export type GetTeamQueryVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type GetTeamQuery = { __typename?: 'Query', team?: { __typename?: 'Team', id: string, name: string, members?: Array<{ __typename?: 'User', id: string, username: string } | null> | null } | { __typename?: 'UserNotPartOfAnyTeam', message: string } | null };

export type JoinTeamMutationVariables = Exact<{
  teamID: Scalars['ID'];
}>;


export type JoinTeamMutation = { __typename?: 'Mutation', joinTeam?: { __typename?: 'JoinTeamFailure', errors: Array<{ __typename?: 'TeamNotFoundError', teamID?: string | null, message: string }> } | { __typename?: 'JoinTeamSuccess', newTeam?: { __typename?: 'Team', id: string } | null } | null };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResult', token: string, user: { __typename?: 'User', id: string, username: string } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type PlayMutationVariables = Exact<{
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
  data: Scalars['JSON'];
}>;


export type PlayMutation = { __typename?: 'Mutation', play?: boolean | null };

export type PlayerConnectedFragment = { __typename?: 'Player', connected?: boolean | null };

export type PlayerFragment = { __typename?: 'Player', id?: string | null, token?: string | null, connected?: boolean | null };

export type RegisterTournamentInvitationLinkMutationVariables = Exact<{
  tournamentInvitationLinkID: Scalars['ID'];
}>;


export type RegisterTournamentInvitationLinkMutation = { __typename?: 'Mutation', registerTournamentInvitationLink?: { __typename?: 'RegisterTournamentInvitationFailure', errors: Array<{ __typename: 'AlreadyInATeamError' } | { __typename: 'TournamentInvitationLinkNotFoundError' }> } | { __typename?: 'RegisterTournamentInvitationSuccess', invitation?: { __typename?: 'TournamentInvitation', id?: string | null, tournament?: { __typename?: 'Tournament', id: string, name: string, lastRoundDate?: any | null, status?: TournamentStatus | null } | null } | null } | null };

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'LoginResult', token: string, user: { __typename?: 'User', id: string, username: string } } | null };

export type RoundSummaryQueryVariables = Exact<{
  roundID: Scalars['ID'];
  teamID: Scalars['ID'];
}>;


export type RoundSummaryQuery = { __typename?: 'Query', round?: { __typename?: 'Round', id?: string | null, status?: RoundStatus | null, startDate?: any | null, teamPoints?: number | null, teamGames?: Array<{ __typename?: 'GameSummary', id?: string | null, losers?: Array<{ __typename?: 'Team', id: string, name: string } | null> | null, winners?: Array<{ __typename?: 'Team', id: string, name: string } | null> | null } | null> | null } | null };

export type TeamPlayerSubscriptionVariables = Exact<{
  teamID: Scalars['ID'];
}>;


export type TeamPlayerSubscription = { __typename?: 'Subscription', teamPlayer?: { __typename?: 'Player', id?: string | null, token?: string | null, connected?: boolean | null } | { __typename?: 'PlayerConnection', playerID?: string | null, connected?: boolean | null } | null };

export type TournamentByInvitationLinkQueryVariables = Exact<{
  tournamentInvitationLinkID: Scalars['ID'];
}>;


export type TournamentByInvitationLinkQuery = { __typename?: 'Query', tournamentByInvitationLink?: { __typename?: 'Tournament', id: string, name: string } | null };

export type TournamentQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
}>;


export type TournamentQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, name: string, status?: TournamentStatus | null, startDate?: any | null, firstRoundDate?: any | null, lastRoundDate?: any | null, roundsNumber?: number | null, minutesBetweenRounds?: number | null, myRole?: TournamentRoleName | null, invitationLinkID?: string | null } | null };

export type TournamentRoundsQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
  maxSize: Scalars['Int'];
  before?: InputMaybe<Scalars['Date']>;
  after?: InputMaybe<Scalars['Date']>;
}>;


export type TournamentRoundsQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, startDate?: any | null, lastRoundDate?: any | null, firstRoundDate?: any | null, roundsNumber?: number | null, minutesBetweenRounds?: number | null, rounds?: Array<{ __typename?: 'Round', id?: string | null, status?: RoundStatus | null, startDate?: any | null, teamPoints?: number | null } | null> | null } | null };

export type TournamentTeamsQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
}>;


export type TournamentTeamsQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, teams?: Array<{ __typename?: 'Team', id: string, name: string, members?: Array<{ __typename?: 'User', id: string, username: string } | null> | null } | null> | null } | null };

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
  winners
  initialState
  patches
}
    `;
export const GamePatchFragmentDoc = gql`
    fragment GamePatch on Game {
  version
  initialState
  patches
  winners
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
export const CreateTeamDocument = gql`
    mutation createTeam($tournamentID: ID!, $input: TeamInput!) {
  createTeam(tournamentID: $tournamentID, input: $input) {
    ... on CreateTeamSuccess {
      team {
        id
        name
      }
    }
    ... on CreateTeamFailure {
      errors {
        ... on Error {
          message
        }
      }
    }
  }
}
    `;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      tournamentID: // value for 'tournamentID'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const UpdateTeamDocument = gql`
    mutation updateTeam($teamID: ID!, $input: TeamInput!) {
  updateTeam(teamID: $teamID, input: $input) {
    ... on UpdateTeamSuccess {
      team {
        id
        name
      }
    }
    ... on UpdateTeamFailure {
      errors {
        ... on Error {
          message
        }
      }
    }
  }
}
    `;
export type UpdateTeamMutationFn = Apollo.MutationFunction<UpdateTeamMutation, UpdateTeamMutationVariables>;

/**
 * __useUpdateTeamMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMutation, { data, loading, error }] = useUpdateTeamMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamMutation, UpdateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTeamMutation, UpdateTeamMutationVariables>(UpdateTeamDocument, options);
      }
export type UpdateTeamMutationHookResult = ReturnType<typeof useUpdateTeamMutation>;
export type UpdateTeamMutationResult = Apollo.MutationResult<UpdateTeamMutation>;
export type UpdateTeamMutationOptions = Apollo.BaseMutationOptions<UpdateTeamMutation, UpdateTeamMutationVariables>;
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
        lastRoundDate
        status
      }
    }
    tournamentInvitations {
      id
      tournament {
        id
        name
        lastRoundDate
        status
      }
    }
    organizedTournaments {
      id
      name
      lastRoundDate
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
export type AuthenticatedUserTournamentsQueryHookResult = ReturnType<typeof useAuthenticatedUserTournamentsQuery>;
export type AuthenticatedUserTournamentsLazyQueryHookResult = ReturnType<typeof useAuthenticatedUserTournamentsLazyQuery>;
export type AuthenticatedUserTournamentsQueryResult = Apollo.QueryResult<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>;
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
export const CreateTournamentDocument = gql`
    mutation createTournament($name: String!, $startDate: Date!, $lastRoundDate: Date!, $roundsNumber: Int!, $minutesBetweenRounds: Int!) {
  createTournament(
    name: $name
    startDate: $startDate
    lastRoundDate: $lastRoundDate
    roundsNumber: $roundsNumber
    minutesBetweenRounds: $minutesBetweenRounds
  ) {
    id
    name
  }
}
    `;
export type CreateTournamentMutationFn = Apollo.MutationFunction<CreateTournamentMutation, CreateTournamentMutationVariables>;

/**
 * __useCreateTournamentMutation__
 *
 * To run a mutation, you first call `useCreateTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTournamentMutation, { data, loading, error }] = useCreateTournamentMutation({
 *   variables: {
 *      name: // value for 'name'
 *      startDate: // value for 'startDate'
 *      lastRoundDate: // value for 'lastRoundDate'
 *      roundsNumber: // value for 'roundsNumber'
 *      minutesBetweenRounds: // value for 'minutesBetweenRounds'
 *   },
 * });
 */
export function useCreateTournamentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTournamentMutation, CreateTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTournamentMutation, CreateTournamentMutationVariables>(CreateTournamentDocument, options);
      }
export type CreateTournamentMutationHookResult = ReturnType<typeof useCreateTournamentMutation>;
export type CreateTournamentMutationResult = Apollo.MutationResult<CreateTournamentMutation>;
export type CreateTournamentMutationOptions = Apollo.BaseMutationOptions<CreateTournamentMutation, CreateTournamentMutationVariables>;
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
      winners
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
      winners
      initialState
      patches
    }
    ... on GameCanceled {
      gameID
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
export const JoinTeamDocument = gql`
    mutation joinTeam($teamID: ID!) {
  joinTeam(teamID: $teamID) {
    ... on JoinTeamSuccess {
      newTeam {
        id
      }
    }
    ... on JoinTeamFailure {
      errors {
        ... on TeamNotFoundError {
          teamID
          message
        }
        ... on Error {
          message
        }
      }
    }
  }
}
    `;
export type JoinTeamMutationFn = Apollo.MutationFunction<JoinTeamMutation, JoinTeamMutationVariables>;

/**
 * __useJoinTeamMutation__
 *
 * To run a mutation, you first call `useJoinTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinTeamMutation, { data, loading, error }] = useJoinTeamMutation({
 *   variables: {
 *      teamID: // value for 'teamID'
 *   },
 * });
 */
export function useJoinTeamMutation(baseOptions?: Apollo.MutationHookOptions<JoinTeamMutation, JoinTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinTeamMutation, JoinTeamMutationVariables>(JoinTeamDocument, options);
      }
export type JoinTeamMutationHookResult = ReturnType<typeof useJoinTeamMutation>;
export type JoinTeamMutationResult = Apollo.MutationResult<JoinTeamMutation>;
export type JoinTeamMutationOptions = Apollo.BaseMutationOptions<JoinTeamMutation, JoinTeamMutationVariables>;
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
    mutation Play($gameID: ID!, $playerID: ID!, $data: JSON!) {
  play(gameID: $gameID, playerID: $playerID, data: $data)
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
export const RegisterTournamentInvitationLinkDocument = gql`
    mutation registerTournamentInvitationLink($tournamentInvitationLinkID: ID!) {
  registerTournamentInvitationLink(
    tournamentInvitationLinkID: $tournamentInvitationLinkID
  ) {
    ... on RegisterTournamentInvitationSuccess {
      invitation {
        id
        tournament {
          id
          name
          lastRoundDate
          status
        }
      }
    }
    ... on RegisterTournamentInvitationFailure {
      errors {
        __typename
      }
    }
  }
}
    `;
export type RegisterTournamentInvitationLinkMutationFn = Apollo.MutationFunction<RegisterTournamentInvitationLinkMutation, RegisterTournamentInvitationLinkMutationVariables>;

/**
 * __useRegisterTournamentInvitationLinkMutation__
 *
 * To run a mutation, you first call `useRegisterTournamentInvitationLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTournamentInvitationLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTournamentInvitationLinkMutation, { data, loading, error }] = useRegisterTournamentInvitationLinkMutation({
 *   variables: {
 *      tournamentInvitationLinkID: // value for 'tournamentInvitationLinkID'
 *   },
 * });
 */
export function useRegisterTournamentInvitationLinkMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTournamentInvitationLinkMutation, RegisterTournamentInvitationLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTournamentInvitationLinkMutation, RegisterTournamentInvitationLinkMutationVariables>(RegisterTournamentInvitationLinkDocument, options);
      }
export type RegisterTournamentInvitationLinkMutationHookResult = ReturnType<typeof useRegisterTournamentInvitationLinkMutation>;
export type RegisterTournamentInvitationLinkMutationResult = Apollo.MutationResult<RegisterTournamentInvitationLinkMutation>;
export type RegisterTournamentInvitationLinkMutationOptions = Apollo.BaseMutationOptions<RegisterTournamentInvitationLinkMutation, RegisterTournamentInvitationLinkMutationVariables>;
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
export const TournamentByInvitationLinkDocument = gql`
    query tournamentByInvitationLink($tournamentInvitationLinkID: ID!) {
  tournamentByInvitationLink(
    tournamentInvitationLinkID: $tournamentInvitationLinkID
  ) {
    id
    name
  }
}
    `;

/**
 * __useTournamentByInvitationLinkQuery__
 *
 * To run a query within a React component, call `useTournamentByInvitationLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentByInvitationLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentByInvitationLinkQuery({
 *   variables: {
 *      tournamentInvitationLinkID: // value for 'tournamentInvitationLinkID'
 *   },
 * });
 */
export function useTournamentByInvitationLinkQuery(baseOptions: Apollo.QueryHookOptions<TournamentByInvitationLinkQuery, TournamentByInvitationLinkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TournamentByInvitationLinkQuery, TournamentByInvitationLinkQueryVariables>(TournamentByInvitationLinkDocument, options);
      }
export function useTournamentByInvitationLinkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TournamentByInvitationLinkQuery, TournamentByInvitationLinkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TournamentByInvitationLinkQuery, TournamentByInvitationLinkQueryVariables>(TournamentByInvitationLinkDocument, options);
        }
export type TournamentByInvitationLinkQueryHookResult = ReturnType<typeof useTournamentByInvitationLinkQuery>;
export type TournamentByInvitationLinkLazyQueryHookResult = ReturnType<typeof useTournamentByInvitationLinkLazyQuery>;
export type TournamentByInvitationLinkQueryResult = Apollo.QueryResult<TournamentByInvitationLinkQuery, TournamentByInvitationLinkQueryVariables>;
export const TournamentDocument = gql`
    query tournament($tournamentID: ID!) {
  tournament(tournamentID: $tournamentID) {
    id
    name
    status
    startDate
    firstRoundDate
    lastRoundDate
    roundsNumber
    minutesBetweenRounds
    myRole
    invitationLinkID
  }
}
    `;

/**
 * __useTournamentQuery__
 *
 * To run a query within a React component, call `useTournamentQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentQuery({
 *   variables: {
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useTournamentQuery(baseOptions: Apollo.QueryHookOptions<TournamentQuery, TournamentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TournamentQuery, TournamentQueryVariables>(TournamentDocument, options);
      }
export function useTournamentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TournamentQuery, TournamentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TournamentQuery, TournamentQueryVariables>(TournamentDocument, options);
        }
export type TournamentQueryHookResult = ReturnType<typeof useTournamentQuery>;
export type TournamentLazyQueryHookResult = ReturnType<typeof useTournamentLazyQuery>;
export type TournamentQueryResult = Apollo.QueryResult<TournamentQuery, TournamentQueryVariables>;
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
export const TournamentTeamsDocument = gql`
    query tournamentTeams($tournamentID: ID!) {
  tournament(tournamentID: $tournamentID) {
    id
    teams {
      id
      name
      members {
        id
        username
      }
    }
  }
}
    `;

/**
 * __useTournamentTeamsQuery__
 *
 * To run a query within a React component, call `useTournamentTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentTeamsQuery({
 *   variables: {
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useTournamentTeamsQuery(baseOptions: Apollo.QueryHookOptions<TournamentTeamsQuery, TournamentTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TournamentTeamsQuery, TournamentTeamsQueryVariables>(TournamentTeamsDocument, options);
      }
export function useTournamentTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TournamentTeamsQuery, TournamentTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TournamentTeamsQuery, TournamentTeamsQueryVariables>(TournamentTeamsDocument, options);
        }
export type TournamentTeamsQueryHookResult = ReturnType<typeof useTournamentTeamsQuery>;
export type TournamentTeamsLazyQueryHookResult = ReturnType<typeof useTournamentTeamsLazyQuery>;
export type TournamentTeamsQueryResult = Apollo.QueryResult<TournamentTeamsQuery, TournamentTeamsQueryVariables>;