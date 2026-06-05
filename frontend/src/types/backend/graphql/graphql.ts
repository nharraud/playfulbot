/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: unknown; output: unknown; }
  JSON: { input: unknown; output: unknown; }
};

export type Arena = {
  __typename: 'Arena';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  team: Team;
};

export type ArenaGamesError = ArenaNotFoundError | ForbiddenError;

export type ArenaGamesFailure = {
  __typename: 'ArenaGamesFailure';
  errors: Array<ArenaGamesError>;
};

export type ArenaGamesResult = ArenaGamesFailure | GameRef;

export type ArenaNameAlreadyTakenError = Error & {
  __typename: 'ArenaNameAlreadyTakenError';
  message: Scalars['String']['output'];
};

export type ArenaNotFoundError = Error & {
  __typename: 'ArenaNotFoundError';
  arenaID: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
};

export type CreateArenaError = ArenaNameAlreadyTakenError | ForbiddenError | MaxArenaReachedError | ValidationError;

export type CreateArenaFailure = {
  __typename: 'CreateArenaFailure';
  errors: Array<CreateArenaError>;
};

export type CreateArenaGameError = ArenaNotFoundError | ForbiddenError;

export type CreateArenaGameFailure = {
  __typename: 'CreateArenaGameFailure';
  errors: Array<CreateArenaGameError>;
};

export type CreateArenaGameResult = CreateArenaGameFailure | CreateArenaGameSuccess;

export type CreateArenaGameSuccess = {
  __typename: 'CreateArenaGameSuccess';
  gameID: Scalars['String']['output'];
};

export type CreateArenaResult = CreateArenaFailure | CreateArenaSuccess;

export type CreateArenaSuccess = {
  __typename: 'CreateArenaSuccess';
  arena: Arena;
};

export type CreateTeamError = ForbiddenError | TeamNameAlreadyTakenError | ValidationError;

export type CreateTeamFailure = {
  __typename: 'CreateTeamFailure';
  errors: Array<CreateTeamError>;
};

export type CreateTeamResult = CreateTeamFailure | CreateTeamSuccess;

export type CreateTeamSuccess = {
  __typename: 'CreateTeamSuccess';
  team: Maybe<Team>;
};

export type DeleteArenaError = ArenaNotFoundError | ForbiddenError;

export type DeleteArenaFailure = {
  __typename: 'DeleteArenaFailure';
  errors: Array<DeleteArenaError>;
};

export type DeleteArenaResult = DeleteArenaFailure | DeleteArenaSuccess;

export type DeleteArenaSuccess = {
  __typename: 'DeleteArenaSuccess';
  arenaID: Scalars['ID']['output'];
};

export type DeletedTeam = {
  __typename: 'DeletedTeam';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Error = {
  message: Scalars['String']['output'];
};

export type ForbiddenError = Error & {
  __typename: 'ForbiddenError';
  message: Scalars['String']['output'];
};

export type GameRef = {
  __typename: 'GameRef';
  gameID: Scalars['String']['output'];
  graphqlUrl: Scalars['String']['output'];
};

export type GetArenaError = ArenaNotFoundError | ForbiddenError;

export type GetArenaFailure = {
  __typename: 'GetArenaFailure';
  errors: Array<GetArenaError>;
};

export type GetArenaResult = GetArenaFailure | GetArenaSuccess;

export type GetArenaSuccess = {
  __typename: 'GetArenaSuccess';
  arena: Maybe<Arena>;
};

export type InvalidCredentialsError = Error & {
  __typename: 'InvalidCredentialsError';
  message: Scalars['String']['output'];
};

export type JoinTeamError = ForbiddenError | TeamNotFoundError;

export type JoinTeamFailure = {
  __typename: 'JoinTeamFailure';
  errors: Array<JoinTeamError>;
};

export type JoinTeamResult = JoinTeamFailure | JoinTeamSuccess;

export type JoinTeamSuccess = {
  __typename: 'JoinTeamSuccess';
  newTeam: Maybe<Team>;
  oldTeam: Maybe<TeamOrDeletedTeam>;
};

export type LoginError = InvalidCredentialsError;

export type LoginFailure = {
  __typename: 'LoginFailure';
  errors: Array<LoginError>;
};

export type LoginResult = LoginFailure | LoginSuccess;

export type LoginSuccess = {
  __typename: 'LoginSuccess';
  token: Scalars['String']['output'];
  user: User;
};

export type MaxArenaReachedError = Error & {
  __typename: 'MaxArenaReachedError';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createArena: Maybe<CreateArenaResult>;
  createArenaGame: Maybe<CreateArenaGameResult>;
  createTeam: Maybe<CreateTeamResult>;
  createTournament: Maybe<Tournament>;
  deleteArena: Maybe<DeleteArenaResult>;
  getArena: Maybe<GetArenaResult>;
  joinTeam: Maybe<JoinTeamResult>;
  login: Maybe<LoginResult>;
  logout: Maybe<Scalars['Boolean']['output']>;
  registerUser: Maybe<UserRegistrationResult>;
  updateTeam: Maybe<UpdateTeamResult>;
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


export type MutationDeleteArenaArgs = {
  arenaID: Scalars['ID']['input'];
};


export type MutationGetArenaArgs = {
  arenaID: Scalars['ID']['input'];
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
  __typename: 'Query';
  authenticatedUser: Maybe<User>;
  team: Maybe<UserTeamResult>;
  tournament: Maybe<Tournament>;
};


export type QueryTeamArgs = {
  tournamentID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type QueryTournamentArgs = {
  tournamentID: Scalars['ID']['input'];
};

export type Subscription = {
  __typename: 'Subscription';
  arenaGames: Maybe<ArenaGamesResult>;
};


export type SubscriptionArenaGamesArgs = {
  arenaID: Scalars['ID']['input'];
};

export type Team = {
  __typename: 'Team';
  arenas: Maybe<Array<Maybe<Arena>>>;
  id: Scalars['ID']['output'];
  members: Maybe<Array<Maybe<User>>>;
  name: Scalars['String']['output'];
  tournament: Tournament;
};

export type TeamInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TeamNameAlreadyTakenError = Error & {
  __typename: 'TeamNameAlreadyTakenError';
  message: Scalars['String']['output'];
};

export type TeamNotFoundError = Error & {
  __typename: 'TeamNotFoundError';
  message: Scalars['String']['output'];
  teamID: Maybe<Scalars['ID']['output']>;
};

export type TeamOrDeletedTeam = DeletedTeam | Team;

export type Tournament = {
  __typename: 'Tournament';
  id: Scalars['ID']['output'];
  myRole: Maybe<TournamentRole>;
  name: Scalars['String']['output'];
  status: Maybe<TournamentStatus>;
  teams: Maybe<Array<Maybe<Team>>>;
};

export type TournamentInvitation = {
  __typename: 'TournamentInvitation';
  invitee: User;
  sentAt: Scalars['Date']['output'];
  tournament: Tournament;
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
  __typename: 'UpdateTeamFailure';
  errors: Array<UpdateTeamError>;
};

export type UpdateTeamResult = UpdateTeamFailure | UpdateTeamSuccess;

export type UpdateTeamSuccess = {
  __typename: 'UpdateTeamSuccess';
  team: Maybe<Team>;
};

export type User = {
  __typename: 'User';
  id: Scalars['ID']['output'];
  organizedTournaments: Maybe<Array<Tournament>>;
  teams: Maybe<Array<Maybe<Team>>>;
  tournamentInvitations: Maybe<Array<TournamentInvitation>>;
  username: Scalars['String']['output'];
};

export type UserNotPartOfAnyTeam = {
  __typename: 'UserNotPartOfAnyTeam';
  message: Scalars['String']['output'];
};

export type UserRegistrationResult = LoginSuccess | UsernameAlreadyTaken | ValidationError;

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type UsernameAlreadyTaken = Error & {
  __typename: 'UsernameAlreadyTaken';
  message: Scalars['String']['output'];
};

export type ValidationError = Error & {
  __typename: 'ValidationError';
  message: Scalars['String']['output'];
};

export type GetTeamArenasQueryVariables = Exact<{
  userID: Scalars['ID']['input'];
  tournamentID: Scalars['ID']['input'];
}>;


export type GetTeamArenasQuery = { team:
    | { __typename: 'Team', id: string, arenas: Array<{ __typename: 'Arena', id: string, name: string } | null> | null }
    | { __typename: 'UserNotPartOfAnyTeam', message: string }
   | null };

export type CreateArenaMutationVariables = Exact<{
  teamID: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateArenaMutation = { createArena:
    | { __typename: 'CreateArenaFailure', errors: Array<
        | { __typename: 'ArenaNameAlreadyTakenError', message: string }
        | { __typename: 'ForbiddenError', message: string }
        | { __typename: 'MaxArenaReachedError', message: string }
        | { __typename: 'ValidationError', message: string }
      > }
    | { __typename: 'CreateArenaSuccess', arena: { __typename: 'Arena', id: string, name: string } }
   | null };

export type DeleteArenaMutationVariables = Exact<{
  arenaID: Scalars['ID']['input'];
}>;


export type DeleteArenaMutation = { deleteArena:
    | { __typename: 'DeleteArenaFailure', errors: Array<
        | { __typename: 'ArenaNotFoundError', message: string }
        | { __typename: 'ForbiddenError', message: string }
      > }
    | { __typename: 'DeleteArenaSuccess', arenaID: string }
   | null };

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = { authenticatedUser: { __typename: 'User', id: string, username: string } | null };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login:
    | { __typename: 'LoginFailure', errors: Array<{ __typename: 'InvalidCredentialsError', message: string }> }
    | { __typename: 'LoginSuccess', token: string, user: { __typename: 'User', id: string, username: string } }
   | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean | null };

export type AuthenticatedUserTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticatedUserTournamentsQuery = { authenticatedUser: { __typename: 'User', id: string, username: string, teams: Array<{ __typename: 'Team', id: string, name: string, tournament: { __typename: 'Tournament', id: string, name: string, status: TournamentStatus | null } } | null> | null, tournamentInvitations: Array<{ __typename: 'TournamentInvitation', tournament: { __typename: 'Tournament', id: string, name: string, status: TournamentStatus | null } }> | null, organizedTournaments: Array<{ __typename: 'Tournament', id: string, name: string, status: TournamentStatus | null }> | null } | null };

export type GetTeamQueryVariables = Exact<{
  userID: Scalars['ID']['input'];
  tournamentID: Scalars['ID']['input'];
}>;


export type GetTeamQuery = { team:
    | { __typename: 'Team', id: string, name: string, members: Array<{ __typename: 'User', id: string, username: string } | null> | null }
    | { __typename: 'UserNotPartOfAnyTeam', message: string }
   | null };

export type CreateTeamMutationVariables = Exact<{
  tournamentID: Scalars['ID']['input'];
  input: TeamInput;
}>;


export type CreateTeamMutation = { createTeam:
    | { __typename: 'CreateTeamFailure', errors: Array<
        | { __typename: 'ForbiddenError', message: string }
        | { __typename: 'TeamNameAlreadyTakenError', message: string }
        | { __typename: 'ValidationError', message: string }
      > }
    | { __typename: 'CreateTeamSuccess', team: { __typename: 'Team', id: string, name: string } | null }
   | null };

export type UpdateTeamMutationVariables = Exact<{
  teamID: Scalars['ID']['input'];
  input: TeamInput;
}>;


export type UpdateTeamMutation = { updateTeam:
    | { __typename: 'UpdateTeamFailure', errors: Array<
        | { __typename: 'ForbiddenError', message: string }
        | { __typename: 'TeamNameAlreadyTakenError', message: string }
        | { __typename: 'ValidationError', message: string }
      > }
    | { __typename: 'UpdateTeamSuccess', team: { __typename: 'Team', id: string, name: string } | null }
   | null };

export type JoinTeamMutationVariables = Exact<{
  teamID: Scalars['ID']['input'];
}>;


export type JoinTeamMutation = { joinTeam:
    | { __typename: 'JoinTeamFailure', errors: Array<
        | { __typename: 'ForbiddenError', message: string }
        | { __typename: 'TeamNotFoundError', teamID: string | null, message: string }
      > }
    | { __typename: 'JoinTeamSuccess', newTeam: { __typename: 'Team', id: string } | null }
   | null };

export type TournamentTeamsQueryVariables = Exact<{
  tournamentID: Scalars['ID']['input'];
}>;


export type TournamentTeamsQuery = { tournament: { __typename: 'Tournament', id: string, teams: Array<{ __typename: 'Team', id: string, name: string, members: Array<{ __typename: 'User', id: string, username: string } | null> | null } | null> | null } | null };

export type ArenaGamesSubscriptionVariables = Exact<{
  arenaID: Scalars['ID']['input'];
}>;


export type ArenaGamesSubscription = { arenaGames:
    | { __typename: 'ArenaGamesFailure', errors: Array<
        | { __typename: 'ArenaNotFoundError', message: string }
        | { __typename: 'ForbiddenError', message: string }
      > }
    | { __typename: 'GameRef', gameID: string, graphqlUrl: string }
   | null };

export type CreateArenaGameMutationVariables = Exact<{
  arenaID: Scalars['ID']['input'];
}>;


export type CreateArenaGameMutation = { createArenaGame:
    | { __typename: 'CreateArenaGameFailure', errors: Array<
        | { __typename: 'ArenaNotFoundError', message: string }
        | { __typename: 'ForbiddenError', message: string }
      > }
    | { __typename: 'CreateArenaGameSuccess', gameID: string }
   | null };

export type TournamentQueryVariables = Exact<{
  tournamentID: Scalars['ID']['input'];
}>;


export type TournamentQuery = { tournament: { __typename: 'Tournament', id: string, name: string, status: TournamentStatus | null, myRole: TournamentRole | null } | null };


export const GetTeamArenasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeamArenas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"tournamentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"arenas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotPartOfAnyTeam"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamArenasQuery, GetTeamArenasQueryVariables>;
export const CreateArenaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createArena"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArena"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArenaSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arena"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArenaFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateArenaMutation, CreateArenaMutationVariables>;
export const DeleteArenaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteArena"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteArena"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arenaID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteArenaSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arenaID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteArenaFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteArenaMutation, DeleteArenaMutationVariables>;
export const GetAuthenticatedUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAuthenticatedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticatedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const AuthenticatedUserTournamentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"authenticatedUserTournaments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticatedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tournament"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tournamentInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tournament"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizedTournaments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<AuthenticatedUserTournamentsQuery, AuthenticatedUserTournamentsQueryVariables>;
export const GetTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"tournamentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotPartOfAnyTeam"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeamQuery, GetTeamQueryVariables>;
export const CreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tournamentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTeamMutation, CreateTeamMutationVariables>;
export const UpdateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTeamMutation, UpdateTeamMutationVariables>;
export const JoinTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"joinTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JoinTeamSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JoinTeamFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamID"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinTeamMutation, JoinTeamMutationVariables>;
export const TournamentTeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tournamentTeams"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tournament"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tournamentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TournamentTeamsQuery, TournamentTeamsQueryVariables>;
export const ArenaGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"arenaGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arenaGames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arenaID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameRef"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameID"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArenaGamesFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArenaGamesSubscription, ArenaGamesSubscriptionVariables>;
export const CreateArenaGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createArenaGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArenaGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arenaID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arenaID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArenaGameSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArenaGameFailure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateArenaGameMutation, CreateArenaGameMutationVariables>;
export const TournamentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tournament"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tournament"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tournamentID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tournamentID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}}]}}]} as unknown as DocumentNode<TournamentQuery, TournamentQueryVariables>;