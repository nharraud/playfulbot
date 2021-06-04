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



export type Error = {
  message: Scalars['String'];
};

export type ForbiddenError = Error & {
  __typename?: 'ForbiddenError';
  message: Scalars['String'];
};

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  message: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  teams?: Maybe<Array<Maybe<Team>>>;
  tournamentInvitations?: Maybe<Array<TournamentInvitation>>;
  organizedTournaments?: Maybe<Array<Tournament>>;
};

export enum TournamentStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED'
}

export enum TournamentRoleName {
  Admin = 'ADMIN'
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
  teams?: Maybe<Array<Maybe<Team>>>;
  rounds?: Maybe<Array<Maybe<Round>>>;
  myRole?: Maybe<TournamentRoleName>;
  invitationLinkID?: Maybe<Scalars['ID']>;
};


export type TournamentRoundsArgs = {
  maxSize?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Date']>;
  after?: Maybe<Scalars['Date']>;
};

export type TournamentInvitation = {
  __typename?: 'TournamentInvitation';
  id?: Maybe<Scalars['ID']>;
  tournament?: Maybe<Tournament>;
  invitee?: Maybe<User>;
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  name: Scalars['String'];
  members?: Maybe<Array<Maybe<User>>>;
  tournament?: Maybe<Tournament>;
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

export type DeletedTeam = {
  __typename?: 'DeletedTeam';
  teamID?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type TeamOrDeletedTeam = Team | DeletedTeam;

export type JoinTeamSuccess = {
  __typename?: 'JoinTeamSuccess';
  oldTeam?: Maybe<TeamOrDeletedTeam>;
  newTeam?: Maybe<Team>;
};

export type JoinTeamFailure = {
  __typename?: 'JoinTeamFailure';
  errors: Array<JoinTeamError>;
};

export type TeamNotFoundError = Error & {
  __typename?: 'TeamNotFoundError';
  message: Scalars['String'];
  teamID?: Maybe<Scalars['ID']>;
};

export type JoinTeamError = TeamNotFoundError;

export type JoinTeamResult = JoinTeamSuccess | JoinTeamFailure;

export type TeamInput = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateTeamSuccess = {
  __typename?: 'UpdateTeamSuccess';
  team?: Maybe<Team>;
};

export type UpdateTeamFailure = {
  __typename?: 'UpdateTeamFailure';
  errors: Array<UpdateTeamError>;
};

export type UpdateTeamError = ForbiddenError | ValidationError;

export type UpdateTeamResult = UpdateTeamSuccess | UpdateTeamFailure;

export type CreateTeamSuccess = {
  __typename?: 'CreateTeamSuccess';
  team?: Maybe<Team>;
};

export type CreateTeamFailure = {
  __typename?: 'CreateTeamFailure';
  errors: Array<CreateTeamError>;
};

export type CreateTeamError = ForbiddenError | ValidationError;

export type CreateTeamResult = CreateTeamSuccess | CreateTeamFailure;

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
  tournamentByInvitationLink?: Maybe<Tournament>;
  round?: Maybe<Round>;
  team?: Maybe<UserTeamResult>;
  authenticatedUser?: Maybe<User>;
};


export type QueryTournamentArgs = {
  tournamentID?: Maybe<Scalars['ID']>;
};


export type QueryTournamentByInvitationLinkArgs = {
  tournamentInvitationLinkID: Scalars['ID'];
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
  registerTournamentInvitationLink?: Maybe<TournamentInvitation>;
  createTeam?: Maybe<CreateTeamResult>;
  updateTeam?: Maybe<UpdateTeamResult>;
  joinTeam?: Maybe<JoinTeamResult>;
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


export type MutationRegisterTournamentInvitationLinkArgs = {
  tournamentInvitationLinkID: Scalars['ID'];
};


export type MutationCreateTeamArgs = {
  tournamentID: Scalars['ID'];
  input: TeamInput;
  join?: Scalars['Boolean'];
};


export type MutationUpdateTeamArgs = {
  teamID: Scalars['ID'];
  input: TeamInput;
};


export type MutationJoinTeamArgs = {
  teamID: Scalars['ID'];
};

export type CreateTeamMutationVariables = Exact<{
  tournamentID: Scalars['ID'];
  input: TeamInput;
}>;


export type CreateTeamMutation = (
  { __typename?: 'Mutation' }
  & { createTeam?: Maybe<(
    { __typename?: 'CreateTeamSuccess' }
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
    )> }
  ) | (
    { __typename?: 'CreateTeamFailure' }
    & { errors: Array<(
      { __typename?: 'ForbiddenError' }
      & Pick<ForbiddenError, 'message'>
    ) | (
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    )> }
  )> }
);

export type UpdateTeamMutationVariables = Exact<{
  teamID: Scalars['ID'];
  input: TeamInput;
}>;


export type UpdateTeamMutation = (
  { __typename?: 'Mutation' }
  & { updateTeam?: Maybe<(
    { __typename?: 'UpdateTeamSuccess' }
    & { team?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
    )> }
  ) | (
    { __typename?: 'UpdateTeamFailure' }
    & { errors: Array<(
      { __typename?: 'ForbiddenError' }
      & Pick<ForbiddenError, 'message'>
    ) | (
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    )> }
  )> }
);

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = (
  { __typename?: 'Query' }
  & { authenticatedUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export type AuthenticatedUserTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticatedUserTournamentsQuery = (
  { __typename?: 'Query' }
  & { authenticatedUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
    & { teams?: Maybe<Array<Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
      & { tournament?: Maybe<(
        { __typename?: 'Tournament' }
        & Pick<Tournament, 'id' | 'name' | 'lastRoundDate' | 'status'>
      )> }
    )>>>, tournamentInvitations?: Maybe<Array<(
      { __typename?: 'TournamentInvitation' }
      & Pick<TournamentInvitation, 'id'>
      & { tournament?: Maybe<(
        { __typename?: 'Tournament' }
        & Pick<Tournament, 'id' | 'name' | 'lastRoundDate' | 'status'>
      )> }
    )>>, organizedTournaments?: Maybe<Array<(
      { __typename?: 'Tournament' }
      & Pick<Tournament, 'id' | 'name' | 'lastRoundDate' | 'status'>
    )>> }
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

export type CreateTournamentMutationVariables = Exact<{
  name: Scalars['String'];
  startDate: Scalars['Date'];
  lastRoundDate: Scalars['Date'];
  roundsNumber: Scalars['Int'];
  minutesBetweenRounds: Scalars['Int'];
}>;


export type CreateTournamentMutation = (
  { __typename?: 'Mutation' }
  & { createTournament?: Maybe<(
    { __typename?: 'Tournament' }
    & Pick<Tournament, 'id' | 'name'>
  )> }
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
    & Pick<GameCanceled, 'gameID' | 'version'>
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

export type JoinTeamMutationVariables = Exact<{
  teamID: Scalars['ID'];
}>;


export type JoinTeamMutation = (
  { __typename?: 'Mutation' }
  & { joinTeam?: Maybe<(
    { __typename?: 'JoinTeamSuccess' }
    & { newTeam?: Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id'>
    )> }
  ) | (
    { __typename?: 'JoinTeamFailure' }
    & { errors: Array<(
      { __typename?: 'TeamNotFoundError' }
      & Pick<TeamNotFoundError, 'teamID' | 'message'>
    )> }
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

export type RegisterTournamentInvitationLinkMutationVariables = Exact<{
  tournamentInvitationLinkID: Scalars['ID'];
}>;


export type RegisterTournamentInvitationLinkMutation = (
  { __typename?: 'Mutation' }
  & { registerTournamentInvitationLink?: Maybe<(
    { __typename?: 'TournamentInvitation' }
    & Pick<TournamentInvitation, 'id'>
    & { tournament?: Maybe<(
      { __typename?: 'Tournament' }
      & Pick<Tournament, 'id' | 'name' | 'lastRoundDate' | 'status'>
    )> }
  )> }
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

export type TournamentByInvitationLinkQueryVariables = Exact<{
  tournamentInvitationLinkID: Scalars['ID'];
}>;


export type TournamentByInvitationLinkQuery = (
  { __typename?: 'Query' }
  & { tournamentByInvitationLink?: Maybe<(
    { __typename?: 'Tournament' }
    & Pick<Tournament, 'id' | 'name'>
  )> }
);

export type TournamentQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
}>;


export type TournamentQuery = (
  { __typename?: 'Query' }
  & { tournament?: Maybe<(
    { __typename?: 'Tournament' }
    & Pick<Tournament, 'id' | 'name' | 'status' | 'startDate' | 'firstRoundDate' | 'lastRoundDate' | 'roundsNumber' | 'minutesBetweenRounds' | 'myRole' | 'invitationLinkID'>
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

export type TournamentTeamsQueryVariables = Exact<{
  tournamentID: Scalars['ID'];
}>;


export type TournamentTeamsQuery = (
  { __typename?: 'Query' }
  & { tournament?: Maybe<(
    { __typename?: 'Tournament' }
    & Pick<Tournament, 'id'>
    & { teams?: Maybe<Array<Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
      & { members?: Maybe<Array<Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )>>> }
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
export const RegisterTournamentInvitationLinkDocument = gql`
    mutation registerTournamentInvitationLink($tournamentInvitationLinkID: ID!) {
  registerTournamentInvitationLink(
    tournamentInvitationLinkID: $tournamentInvitationLinkID
  ) {
    id
    tournament {
      id
      name
      lastRoundDate
      status
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