import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players?: Maybe<Array<Maybe<Player>>>;
  team?: Maybe<Team>;
};

export type ArenaError = ArenaNotFoundError | ForbiddenError;

export type ArenaFailure = {
  __typename?: 'ArenaFailure';
  errors: Array<ArenaError>;
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

export type ArenaResult = ArenaFailure | ArenaSuccess;

export type ArenaSuccess = {
  __typename?: 'ArenaSuccess';
  arena?: Maybe<Arena>;
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
  arena: Arena;
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

export type DeleteArenaError = ArenaNotFoundError | ForbiddenError;

export type DeleteArenaFailure = {
  __typename?: 'DeleteArenaFailure';
  errors: Array<DeleteArenaError>;
};

export type DeleteArenaResult = DeleteArenaFailure | DeleteArenaSuccess;

export type DeleteArenaSuccess = {
  __typename?: 'DeleteArenaSuccess';
  arenaID: Scalars['ID']['output'];
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

export type InvalidCredentialsError = Error & {
  __typename?: 'InvalidCredentialsError';
  message: Scalars['String']['output'];
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

export type LoginError = InvalidCredentialsError;

export type LoginFailure = {
  __typename?: 'LoginFailure';
  errors: Array<LoginError>;
};

export type LoginResult = LoginFailure | LoginSuccess;

export type LoginSuccess = {
  __typename?: 'LoginSuccess';
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
  deleteArena?: Maybe<DeleteArenaResult>;
  joinTeam?: Maybe<JoinTeamResult>;
  login?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  registerUser?: Maybe<UserRegistrationResult>;
  updateTeam?: Maybe<UpdateTeamResult>;
  updateTournamentConfiguration?: Maybe<UpdateTournamentConfigurationResult>;
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
  endDate: Scalars['Date']['input'];
  name: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
};


export type MutationDeleteArenaArgs = {
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


export type MutationUpdateTournamentConfigurationArgs = {
  input: TournamentConfigurationInput;
  tournamentID: Scalars['ID']['input'];
};

export type Player = {
  __typename?: 'Player';
  connected?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  arena?: Maybe<ArenaResult>;
  authenticatedUser?: Maybe<User>;
  team?: Maybe<UserTeamResult>;
  tournament?: Maybe<Tournament>;
};


export type QueryArenaArgs = {
  arenaID: Scalars['ID']['input'];
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
  arenas?: Maybe<Array<Maybe<Arena>>>;
  id: Scalars['ID']['output'];
  members?: Maybe<Array<Maybe<User>>>;
  name: Scalars['String']['output'];
  tournament: Tournament;
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
  endDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  myRole?: Maybe<TournamentRole>;
  name: Scalars['String']['output'];
  startDate?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<TournamentStatus>;
  teams?: Maybe<Array<Maybe<Team>>>;
};

export type TournamentConfigurationInput = {
  endDate: Scalars['Date']['input'];
  name: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
};

export type TournamentInvitation = {
  __typename?: 'TournamentInvitation';
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
  __typename?: 'UpdateTeamFailure';
  errors: Array<UpdateTeamError>;
};

export type UpdateTeamResult = UpdateTeamFailure | UpdateTeamSuccess;

export type UpdateTeamSuccess = {
  __typename?: 'UpdateTeamSuccess';
  team?: Maybe<Team>;
};

export type UpdateTournamentConfigurationError = ForbiddenError | ValidationError;

export type UpdateTournamentConfigurationFailure = {
  __typename?: 'UpdateTournamentConfigurationFailure';
  errors: Array<UpdateTournamentConfigurationError>;
};

export type UpdateTournamentConfigurationResult = UpdateTournamentConfigurationFailure | UpdateTournamentConfigurationSuccess;

export type UpdateTournamentConfigurationSuccess = {
  __typename?: 'UpdateTournamentConfigurationSuccess';
  tournament?: Maybe<Tournament>;
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

export type UserRegistrationResult = LoginSuccess | UsernameAlreadyTaken | ValidationError;

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type UsernameAlreadyTaken = Error & {
  __typename?: 'UsernameAlreadyTaken';
  message: Scalars['String']['output'];
};

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  message: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  ArenaError: ( ArenaNotFoundError ) | ( ForbiddenError );
  ArenaGamesError: ( ArenaNotFoundError ) | ( ForbiddenError );
  ArenaGamesResult: ( Omit<ArenaGamesFailure, 'errors'> & { errors: Array<_RefType['ArenaGamesError']> } ) | ( GameRef );
  ArenaResult: ( Omit<ArenaFailure, 'errors'> & { errors: Array<_RefType['ArenaError']> } ) | ( ArenaSuccess );
  CreateArenaError: ( ArenaNameAlreadyTakenError ) | ( ForbiddenError ) | ( MaxArenaReachedError ) | ( ValidationError );
  CreateArenaGameError: ( ArenaNotFoundError ) | ( ForbiddenError );
  CreateArenaGameResult: ( Omit<CreateArenaGameFailure, 'errors'> & { errors: Array<_RefType['CreateArenaGameError']> } ) | ( CreateArenaGameSuccess );
  CreateArenaResult: ( Omit<CreateArenaFailure, 'errors'> & { errors: Array<_RefType['CreateArenaError']> } ) | ( CreateArenaSuccess );
  CreateTeamError: ( ForbiddenError ) | ( TeamNameAlreadyTakenError ) | ( ValidationError );
  CreateTeamResult: ( Omit<CreateTeamFailure, 'errors'> & { errors: Array<_RefType['CreateTeamError']> } ) | ( CreateTeamSuccess );
  DeleteArenaError: ( ArenaNotFoundError ) | ( ForbiddenError );
  DeleteArenaResult: ( Omit<DeleteArenaFailure, 'errors'> & { errors: Array<_RefType['DeleteArenaError']> } ) | ( DeleteArenaSuccess );
  JoinTeamError: ( ForbiddenError ) | ( TeamNotFoundError );
  JoinTeamResult: ( Omit<JoinTeamFailure, 'errors'> & { errors: Array<_RefType['JoinTeamError']> } ) | ( Omit<JoinTeamSuccess, 'oldTeam'> & { oldTeam?: Maybe<_RefType['TeamOrDeletedTeam']> } );
  LoginError: ( InvalidCredentialsError );
  LoginResult: ( Omit<LoginFailure, 'errors'> & { errors: Array<_RefType['LoginError']> } ) | ( LoginSuccess );
  TeamOrDeletedTeam: ( DeletedTeam ) | ( Team );
  UpdateTeamError: ( ForbiddenError ) | ( TeamNameAlreadyTakenError ) | ( ValidationError );
  UpdateTeamResult: ( Omit<UpdateTeamFailure, 'errors'> & { errors: Array<_RefType['UpdateTeamError']> } ) | ( UpdateTeamSuccess );
  UpdateTournamentConfigurationError: ( ForbiddenError ) | ( ValidationError );
  UpdateTournamentConfigurationResult: ( Omit<UpdateTournamentConfigurationFailure, 'errors'> & { errors: Array<_RefType['UpdateTournamentConfigurationError']> } ) | ( UpdateTournamentConfigurationSuccess );
  UserRegistrationResult: ( LoginSuccess ) | ( UsernameAlreadyTaken ) | ( ValidationError );
  UserTeamResult: ( Team ) | ( UserNotPartOfAnyTeam );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Error: ( ArenaNameAlreadyTakenError ) | ( ArenaNotFoundError ) | ( ForbiddenError ) | ( InvalidCredentialsError ) | ( MaxArenaReachedError ) | ( TeamNameAlreadyTakenError ) | ( TeamNotFoundError ) | ( UsernameAlreadyTaken ) | ( ValidationError );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Arena: ResolverTypeWrapper<Arena>;
  ArenaError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ArenaError']>;
  ArenaFailure: ResolverTypeWrapper<Omit<ArenaFailure, 'errors'> & { errors: Array<ResolversTypes['ArenaError']> }>;
  ArenaGamesError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ArenaGamesError']>;
  ArenaGamesFailure: ResolverTypeWrapper<Omit<ArenaGamesFailure, 'errors'> & { errors: Array<ResolversTypes['ArenaGamesError']> }>;
  ArenaGamesResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ArenaGamesResult']>;
  ArenaNameAlreadyTakenError: ResolverTypeWrapper<ArenaNameAlreadyTakenError>;
  ArenaNotFoundError: ResolverTypeWrapper<ArenaNotFoundError>;
  ArenaResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ArenaResult']>;
  ArenaSuccess: ResolverTypeWrapper<ArenaSuccess>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateArenaError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateArenaError']>;
  CreateArenaFailure: ResolverTypeWrapper<Omit<CreateArenaFailure, 'errors'> & { errors: Array<ResolversTypes['CreateArenaError']> }>;
  CreateArenaGameError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateArenaGameError']>;
  CreateArenaGameFailure: ResolverTypeWrapper<Omit<CreateArenaGameFailure, 'errors'> & { errors: Array<ResolversTypes['CreateArenaGameError']> }>;
  CreateArenaGameResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateArenaGameResult']>;
  CreateArenaGameSuccess: ResolverTypeWrapper<CreateArenaGameSuccess>;
  CreateArenaResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateArenaResult']>;
  CreateArenaSuccess: ResolverTypeWrapper<CreateArenaSuccess>;
  CreateTeamError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateTeamError']>;
  CreateTeamFailure: ResolverTypeWrapper<Omit<CreateTeamFailure, 'errors'> & { errors: Array<ResolversTypes['CreateTeamError']> }>;
  CreateTeamResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateTeamResult']>;
  CreateTeamSuccess: ResolverTypeWrapper<CreateTeamSuccess>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteArenaError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteArenaError']>;
  DeleteArenaFailure: ResolverTypeWrapper<Omit<DeleteArenaFailure, 'errors'> & { errors: Array<ResolversTypes['DeleteArenaError']> }>;
  DeleteArenaResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteArenaResult']>;
  DeleteArenaSuccess: ResolverTypeWrapper<DeleteArenaSuccess>;
  DeletedTeam: ResolverTypeWrapper<DeletedTeam>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  ForbiddenError: ResolverTypeWrapper<ForbiddenError>;
  GameRef: ResolverTypeWrapper<GameRef>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  InvalidCredentialsError: ResolverTypeWrapper<InvalidCredentialsError>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JoinTeamError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['JoinTeamError']>;
  JoinTeamFailure: ResolverTypeWrapper<Omit<JoinTeamFailure, 'errors'> & { errors: Array<ResolversTypes['JoinTeamError']> }>;
  JoinTeamResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['JoinTeamResult']>;
  JoinTeamSuccess: ResolverTypeWrapper<Omit<JoinTeamSuccess, 'oldTeam'> & { oldTeam?: Maybe<ResolversTypes['TeamOrDeletedTeam']> }>;
  LoginError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginError']>;
  LoginFailure: ResolverTypeWrapper<Omit<LoginFailure, 'errors'> & { errors: Array<ResolversTypes['LoginError']> }>;
  LoginResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginResult']>;
  LoginSuccess: ResolverTypeWrapper<LoginSuccess>;
  MaxArenaReachedError: ResolverTypeWrapper<MaxArenaReachedError>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Team: ResolverTypeWrapper<Team>;
  TeamInput: TeamInput;
  TeamNameAlreadyTakenError: ResolverTypeWrapper<TeamNameAlreadyTakenError>;
  TeamNotFoundError: ResolverTypeWrapper<TeamNotFoundError>;
  TeamOrDeletedTeam: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TeamOrDeletedTeam']>;
  Tournament: ResolverTypeWrapper<Tournament>;
  TournamentConfigurationInput: TournamentConfigurationInput;
  TournamentInvitation: ResolverTypeWrapper<TournamentInvitation>;
  TournamentRole: TournamentRole;
  TournamentStatus: TournamentStatus;
  UpdateTeamError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateTeamError']>;
  UpdateTeamFailure: ResolverTypeWrapper<Omit<UpdateTeamFailure, 'errors'> & { errors: Array<ResolversTypes['UpdateTeamError']> }>;
  UpdateTeamResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateTeamResult']>;
  UpdateTeamSuccess: ResolverTypeWrapper<UpdateTeamSuccess>;
  UpdateTournamentConfigurationError: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateTournamentConfigurationError']>;
  UpdateTournamentConfigurationFailure: ResolverTypeWrapper<Omit<UpdateTournamentConfigurationFailure, 'errors'> & { errors: Array<ResolversTypes['UpdateTournamentConfigurationError']> }>;
  UpdateTournamentConfigurationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateTournamentConfigurationResult']>;
  UpdateTournamentConfigurationSuccess: ResolverTypeWrapper<UpdateTournamentConfigurationSuccess>;
  User: ResolverTypeWrapper<User>;
  UserNotPartOfAnyTeam: ResolverTypeWrapper<UserNotPartOfAnyTeam>;
  UserRegistrationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserRegistrationResult']>;
  UserTeamResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserTeamResult']>;
  UsernameAlreadyTaken: ResolverTypeWrapper<UsernameAlreadyTaken>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Arena: Arena;
  ArenaError: ResolversUnionTypes<ResolversParentTypes>['ArenaError'];
  ArenaFailure: Omit<ArenaFailure, 'errors'> & { errors: Array<ResolversParentTypes['ArenaError']> };
  ArenaGamesError: ResolversUnionTypes<ResolversParentTypes>['ArenaGamesError'];
  ArenaGamesFailure: Omit<ArenaGamesFailure, 'errors'> & { errors: Array<ResolversParentTypes['ArenaGamesError']> };
  ArenaGamesResult: ResolversUnionTypes<ResolversParentTypes>['ArenaGamesResult'];
  ArenaNameAlreadyTakenError: ArenaNameAlreadyTakenError;
  ArenaNotFoundError: ArenaNotFoundError;
  ArenaResult: ResolversUnionTypes<ResolversParentTypes>['ArenaResult'];
  ArenaSuccess: ArenaSuccess;
  Boolean: Scalars['Boolean']['output'];
  CreateArenaError: ResolversUnionTypes<ResolversParentTypes>['CreateArenaError'];
  CreateArenaFailure: Omit<CreateArenaFailure, 'errors'> & { errors: Array<ResolversParentTypes['CreateArenaError']> };
  CreateArenaGameError: ResolversUnionTypes<ResolversParentTypes>['CreateArenaGameError'];
  CreateArenaGameFailure: Omit<CreateArenaGameFailure, 'errors'> & { errors: Array<ResolversParentTypes['CreateArenaGameError']> };
  CreateArenaGameResult: ResolversUnionTypes<ResolversParentTypes>['CreateArenaGameResult'];
  CreateArenaGameSuccess: CreateArenaGameSuccess;
  CreateArenaResult: ResolversUnionTypes<ResolversParentTypes>['CreateArenaResult'];
  CreateArenaSuccess: CreateArenaSuccess;
  CreateTeamError: ResolversUnionTypes<ResolversParentTypes>['CreateTeamError'];
  CreateTeamFailure: Omit<CreateTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['CreateTeamError']> };
  CreateTeamResult: ResolversUnionTypes<ResolversParentTypes>['CreateTeamResult'];
  CreateTeamSuccess: CreateTeamSuccess;
  Date: Scalars['Date']['output'];
  DeleteArenaError: ResolversUnionTypes<ResolversParentTypes>['DeleteArenaError'];
  DeleteArenaFailure: Omit<DeleteArenaFailure, 'errors'> & { errors: Array<ResolversParentTypes['DeleteArenaError']> };
  DeleteArenaResult: ResolversUnionTypes<ResolversParentTypes>['DeleteArenaResult'];
  DeleteArenaSuccess: DeleteArenaSuccess;
  DeletedTeam: DeletedTeam;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  ForbiddenError: ForbiddenError;
  GameRef: GameRef;
  ID: Scalars['ID']['output'];
  InvalidCredentialsError: InvalidCredentialsError;
  JSON: Scalars['JSON']['output'];
  JoinTeamError: ResolversUnionTypes<ResolversParentTypes>['JoinTeamError'];
  JoinTeamFailure: Omit<JoinTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['JoinTeamError']> };
  JoinTeamResult: ResolversUnionTypes<ResolversParentTypes>['JoinTeamResult'];
  JoinTeamSuccess: Omit<JoinTeamSuccess, 'oldTeam'> & { oldTeam?: Maybe<ResolversParentTypes['TeamOrDeletedTeam']> };
  LoginError: ResolversUnionTypes<ResolversParentTypes>['LoginError'];
  LoginFailure: Omit<LoginFailure, 'errors'> & { errors: Array<ResolversParentTypes['LoginError']> };
  LoginResult: ResolversUnionTypes<ResolversParentTypes>['LoginResult'];
  LoginSuccess: LoginSuccess;
  MaxArenaReachedError: MaxArenaReachedError;
  Mutation: {};
  Player: Player;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  Team: Team;
  TeamInput: TeamInput;
  TeamNameAlreadyTakenError: TeamNameAlreadyTakenError;
  TeamNotFoundError: TeamNotFoundError;
  TeamOrDeletedTeam: ResolversUnionTypes<ResolversParentTypes>['TeamOrDeletedTeam'];
  Tournament: Tournament;
  TournamentConfigurationInput: TournamentConfigurationInput;
  TournamentInvitation: TournamentInvitation;
  UpdateTeamError: ResolversUnionTypes<ResolversParentTypes>['UpdateTeamError'];
  UpdateTeamFailure: Omit<UpdateTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['UpdateTeamError']> };
  UpdateTeamResult: ResolversUnionTypes<ResolversParentTypes>['UpdateTeamResult'];
  UpdateTeamSuccess: UpdateTeamSuccess;
  UpdateTournamentConfigurationError: ResolversUnionTypes<ResolversParentTypes>['UpdateTournamentConfigurationError'];
  UpdateTournamentConfigurationFailure: Omit<UpdateTournamentConfigurationFailure, 'errors'> & { errors: Array<ResolversParentTypes['UpdateTournamentConfigurationError']> };
  UpdateTournamentConfigurationResult: ResolversUnionTypes<ResolversParentTypes>['UpdateTournamentConfigurationResult'];
  UpdateTournamentConfigurationSuccess: UpdateTournamentConfigurationSuccess;
  User: User;
  UserNotPartOfAnyTeam: UserNotPartOfAnyTeam;
  UserRegistrationResult: ResolversUnionTypes<ResolversParentTypes>['UserRegistrationResult'];
  UserTeamResult: ResolversUnionTypes<ResolversParentTypes>['UserTeamResult'];
  UsernameAlreadyTaken: UsernameAlreadyTaken;
  ValidationError: ValidationError;
};

export type ArenaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Arena'] = ResolversParentTypes['Arena']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArenaErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaError'] = ResolversParentTypes['ArenaError']> = {
  __resolveType: TypeResolveFn<'ArenaNotFoundError' | 'ForbiddenError', ParentType, ContextType>;
};

export type ArenaFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaFailure'] = ResolversParentTypes['ArenaFailure']> = {
  errors?: Resolver<Array<ResolversTypes['ArenaError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArenaGamesErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaGamesError'] = ResolversParentTypes['ArenaGamesError']> = {
  __resolveType: TypeResolveFn<'ArenaNotFoundError' | 'ForbiddenError', ParentType, ContextType>;
};

export type ArenaGamesFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaGamesFailure'] = ResolversParentTypes['ArenaGamesFailure']> = {
  errors?: Resolver<Array<ResolversTypes['ArenaGamesError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArenaGamesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaGamesResult'] = ResolversParentTypes['ArenaGamesResult']> = {
  __resolveType: TypeResolveFn<'ArenaGamesFailure' | 'GameRef', ParentType, ContextType>;
};

export type ArenaNameAlreadyTakenErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaNameAlreadyTakenError'] = ResolversParentTypes['ArenaNameAlreadyTakenError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArenaNotFoundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaNotFoundError'] = ResolversParentTypes['ArenaNotFoundError']> = {
  arenaID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArenaResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaResult'] = ResolversParentTypes['ArenaResult']> = {
  __resolveType: TypeResolveFn<'ArenaFailure' | 'ArenaSuccess', ParentType, ContextType>;
};

export type ArenaSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArenaSuccess'] = ResolversParentTypes['ArenaSuccess']> = {
  arena?: Resolver<Maybe<ResolversTypes['Arena']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateArenaErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaError'] = ResolversParentTypes['CreateArenaError']> = {
  __resolveType: TypeResolveFn<'ArenaNameAlreadyTakenError' | 'ForbiddenError' | 'MaxArenaReachedError' | 'ValidationError', ParentType, ContextType>;
};

export type CreateArenaFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaFailure'] = ResolversParentTypes['CreateArenaFailure']> = {
  errors?: Resolver<Array<ResolversTypes['CreateArenaError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateArenaGameErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaGameError'] = ResolversParentTypes['CreateArenaGameError']> = {
  __resolveType: TypeResolveFn<'ArenaNotFoundError' | 'ForbiddenError', ParentType, ContextType>;
};

export type CreateArenaGameFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaGameFailure'] = ResolversParentTypes['CreateArenaGameFailure']> = {
  errors?: Resolver<Array<ResolversTypes['CreateArenaGameError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateArenaGameResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaGameResult'] = ResolversParentTypes['CreateArenaGameResult']> = {
  __resolveType: TypeResolveFn<'CreateArenaGameFailure' | 'CreateArenaGameSuccess', ParentType, ContextType>;
};

export type CreateArenaGameSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaGameSuccess'] = ResolversParentTypes['CreateArenaGameSuccess']> = {
  gameID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateArenaResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaResult'] = ResolversParentTypes['CreateArenaResult']> = {
  __resolveType: TypeResolveFn<'CreateArenaFailure' | 'CreateArenaSuccess', ParentType, ContextType>;
};

export type CreateArenaSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArenaSuccess'] = ResolversParentTypes['CreateArenaSuccess']> = {
  arena?: Resolver<ResolversTypes['Arena'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamError'] = ResolversParentTypes['CreateTeamError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'TeamNameAlreadyTakenError' | 'ValidationError', ParentType, ContextType>;
};

export type CreateTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamFailure'] = ResolversParentTypes['CreateTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['CreateTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamResult'] = ResolversParentTypes['CreateTeamResult']> = {
  __resolveType: TypeResolveFn<'CreateTeamFailure' | 'CreateTeamSuccess', ParentType, ContextType>;
};

export type CreateTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamSuccess'] = ResolversParentTypes['CreateTeamSuccess']> = {
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DeleteArenaErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteArenaError'] = ResolversParentTypes['DeleteArenaError']> = {
  __resolveType: TypeResolveFn<'ArenaNotFoundError' | 'ForbiddenError', ParentType, ContextType>;
};

export type DeleteArenaFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteArenaFailure'] = ResolversParentTypes['DeleteArenaFailure']> = {
  errors?: Resolver<Array<ResolversTypes['DeleteArenaError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteArenaResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteArenaResult'] = ResolversParentTypes['DeleteArenaResult']> = {
  __resolveType: TypeResolveFn<'DeleteArenaFailure' | 'DeleteArenaSuccess', ParentType, ContextType>;
};

export type DeleteArenaSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteArenaSuccess'] = ResolversParentTypes['DeleteArenaSuccess']> = {
  arenaID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletedTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeletedTeam'] = ResolversParentTypes['DeletedTeam']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  __resolveType: TypeResolveFn<'ArenaNameAlreadyTakenError' | 'ArenaNotFoundError' | 'ForbiddenError' | 'InvalidCredentialsError' | 'MaxArenaReachedError' | 'TeamNameAlreadyTakenError' | 'TeamNotFoundError' | 'UsernameAlreadyTaken' | 'ValidationError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ForbiddenErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ForbiddenError'] = ResolversParentTypes['ForbiddenError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameRefResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameRef'] = ResolversParentTypes['GameRef']> = {
  gameID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  graphqlUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvalidCredentialsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidCredentialsError'] = ResolversParentTypes['InvalidCredentialsError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JoinTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamError'] = ResolversParentTypes['JoinTeamError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'TeamNotFoundError', ParentType, ContextType>;
};

export type JoinTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamFailure'] = ResolversParentTypes['JoinTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['JoinTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JoinTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamResult'] = ResolversParentTypes['JoinTeamResult']> = {
  __resolveType: TypeResolveFn<'JoinTeamFailure' | 'JoinTeamSuccess', ParentType, ContextType>;
};

export type JoinTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamSuccess'] = ResolversParentTypes['JoinTeamSuccess']> = {
  newTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  oldTeam?: Resolver<Maybe<ResolversTypes['TeamOrDeletedTeam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginError'] = ResolversParentTypes['LoginError']> = {
  __resolveType: TypeResolveFn<'InvalidCredentialsError', ParentType, ContextType>;
};

export type LoginFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginFailure'] = ResolversParentTypes['LoginFailure']> = {
  errors?: Resolver<Array<ResolversTypes['LoginError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  __resolveType: TypeResolveFn<'LoginFailure' | 'LoginSuccess', ParentType, ContextType>;
};

export type LoginSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginSuccess'] = ResolversParentTypes['LoginSuccess']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MaxArenaReachedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MaxArenaReachedError'] = ResolversParentTypes['MaxArenaReachedError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createArena?: Resolver<Maybe<ResolversTypes['CreateArenaResult']>, ParentType, ContextType, RequireFields<MutationCreateArenaArgs, 'name' | 'teamID'>>;
  createArenaGame?: Resolver<Maybe<ResolversTypes['CreateArenaGameResult']>, ParentType, ContextType, RequireFields<MutationCreateArenaGameArgs, 'arenaID'>>;
  createTeam?: Resolver<Maybe<ResolversTypes['CreateTeamResult']>, ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'input' | 'join' | 'tournamentID'>>;
  createTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationCreateTournamentArgs, 'endDate' | 'name' | 'startDate'>>;
  deleteArena?: Resolver<Maybe<ResolversTypes['DeleteArenaResult']>, ParentType, ContextType, RequireFields<MutationDeleteArenaArgs, 'arenaID'>>;
  joinTeam?: Resolver<Maybe<ResolversTypes['JoinTeamResult']>, ParentType, ContextType, RequireFields<MutationJoinTeamArgs, 'teamID'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  registerUser?: Resolver<Maybe<ResolversTypes['UserRegistrationResult']>, ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'password' | 'username'>>;
  updateTeam?: Resolver<Maybe<ResolversTypes['UpdateTeamResult']>, ParentType, ContextType, RequireFields<MutationUpdateTeamArgs, 'input' | 'teamID'>>;
  updateTournamentConfiguration?: Resolver<Maybe<ResolversTypes['UpdateTournamentConfigurationResult']>, ParentType, ContextType, RequireFields<MutationUpdateTournamentConfigurationArgs, 'input' | 'tournamentID'>>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  connected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  arena?: Resolver<Maybe<ResolversTypes['ArenaResult']>, ParentType, ContextType, RequireFields<QueryArenaArgs, 'arenaID'>>;
  authenticatedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['UserTeamResult']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'tournamentID' | 'userID'>>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryTournamentArgs, 'tournamentID'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  arenaGames?: SubscriptionResolver<Maybe<ResolversTypes['ArenaGamesResult']>, "arenaGames", ParentType, ContextType, RequireFields<SubscriptionArenaGamesArgs, 'arenaID'>>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  arenas?: Resolver<Maybe<Array<Maybe<ResolversTypes['Arena']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tournament?: Resolver<ResolversTypes['Tournament'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamNameAlreadyTakenErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamNameAlreadyTakenError'] = ResolversParentTypes['TeamNameAlreadyTakenError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamNotFoundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamNotFoundError'] = ResolversParentTypes['TeamNotFoundError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamOrDeletedTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamOrDeletedTeam'] = ResolversParentTypes['TeamOrDeletedTeam']> = {
  __resolveType: TypeResolveFn<'DeletedTeam' | 'Team', ParentType, ContextType>;
};

export type TournamentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tournament'] = ResolversParentTypes['Tournament']> = {
  endDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  myRole?: Resolver<Maybe<ResolversTypes['TournamentRole']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['TournamentStatus']>, ParentType, ContextType>;
  teams?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TournamentInvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TournamentInvitation'] = ResolversParentTypes['TournamentInvitation']> = {
  invitee?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sentAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  tournament?: Resolver<ResolversTypes['Tournament'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamError'] = ResolversParentTypes['UpdateTeamError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'TeamNameAlreadyTakenError' | 'ValidationError', ParentType, ContextType>;
};

export type UpdateTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamFailure'] = ResolversParentTypes['UpdateTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['UpdateTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamResult'] = ResolversParentTypes['UpdateTeamResult']> = {
  __resolveType: TypeResolveFn<'UpdateTeamFailure' | 'UpdateTeamSuccess', ParentType, ContextType>;
};

export type UpdateTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamSuccess'] = ResolversParentTypes['UpdateTeamSuccess']> = {
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTournamentConfigurationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTournamentConfigurationError'] = ResolversParentTypes['UpdateTournamentConfigurationError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'ValidationError', ParentType, ContextType>;
};

export type UpdateTournamentConfigurationFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTournamentConfigurationFailure'] = ResolversParentTypes['UpdateTournamentConfigurationFailure']> = {
  errors?: Resolver<Array<ResolversTypes['UpdateTournamentConfigurationError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTournamentConfigurationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTournamentConfigurationResult'] = ResolversParentTypes['UpdateTournamentConfigurationResult']> = {
  __resolveType: TypeResolveFn<'UpdateTournamentConfigurationFailure' | 'UpdateTournamentConfigurationSuccess', ParentType, ContextType>;
};

export type UpdateTournamentConfigurationSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTournamentConfigurationSuccess'] = ResolversParentTypes['UpdateTournamentConfigurationSuccess']> = {
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizedTournaments?: Resolver<Maybe<Array<ResolversTypes['Tournament']>>, ParentType, ContextType>;
  teams?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  tournamentInvitations?: Resolver<Maybe<Array<ResolversTypes['TournamentInvitation']>>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserNotPartOfAnyTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserNotPartOfAnyTeam'] = ResolversParentTypes['UserNotPartOfAnyTeam']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRegistrationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRegistrationResult'] = ResolversParentTypes['UserRegistrationResult']> = {
  __resolveType: TypeResolveFn<'LoginSuccess' | 'UsernameAlreadyTaken' | 'ValidationError', ParentType, ContextType>;
};

export type UserTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTeamResult'] = ResolversParentTypes['UserTeamResult']> = {
  __resolveType: TypeResolveFn<'Team' | 'UserNotPartOfAnyTeam', ParentType, ContextType>;
};

export type UsernameAlreadyTakenResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsernameAlreadyTaken'] = ResolversParentTypes['UsernameAlreadyTaken']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Arena?: ArenaResolvers<ContextType>;
  ArenaError?: ArenaErrorResolvers<ContextType>;
  ArenaFailure?: ArenaFailureResolvers<ContextType>;
  ArenaGamesError?: ArenaGamesErrorResolvers<ContextType>;
  ArenaGamesFailure?: ArenaGamesFailureResolvers<ContextType>;
  ArenaGamesResult?: ArenaGamesResultResolvers<ContextType>;
  ArenaNameAlreadyTakenError?: ArenaNameAlreadyTakenErrorResolvers<ContextType>;
  ArenaNotFoundError?: ArenaNotFoundErrorResolvers<ContextType>;
  ArenaResult?: ArenaResultResolvers<ContextType>;
  ArenaSuccess?: ArenaSuccessResolvers<ContextType>;
  CreateArenaError?: CreateArenaErrorResolvers<ContextType>;
  CreateArenaFailure?: CreateArenaFailureResolvers<ContextType>;
  CreateArenaGameError?: CreateArenaGameErrorResolvers<ContextType>;
  CreateArenaGameFailure?: CreateArenaGameFailureResolvers<ContextType>;
  CreateArenaGameResult?: CreateArenaGameResultResolvers<ContextType>;
  CreateArenaGameSuccess?: CreateArenaGameSuccessResolvers<ContextType>;
  CreateArenaResult?: CreateArenaResultResolvers<ContextType>;
  CreateArenaSuccess?: CreateArenaSuccessResolvers<ContextType>;
  CreateTeamError?: CreateTeamErrorResolvers<ContextType>;
  CreateTeamFailure?: CreateTeamFailureResolvers<ContextType>;
  CreateTeamResult?: CreateTeamResultResolvers<ContextType>;
  CreateTeamSuccess?: CreateTeamSuccessResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeleteArenaError?: DeleteArenaErrorResolvers<ContextType>;
  DeleteArenaFailure?: DeleteArenaFailureResolvers<ContextType>;
  DeleteArenaResult?: DeleteArenaResultResolvers<ContextType>;
  DeleteArenaSuccess?: DeleteArenaSuccessResolvers<ContextType>;
  DeletedTeam?: DeletedTeamResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  ForbiddenError?: ForbiddenErrorResolvers<ContextType>;
  GameRef?: GameRefResolvers<ContextType>;
  InvalidCredentialsError?: InvalidCredentialsErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JoinTeamError?: JoinTeamErrorResolvers<ContextType>;
  JoinTeamFailure?: JoinTeamFailureResolvers<ContextType>;
  JoinTeamResult?: JoinTeamResultResolvers<ContextType>;
  JoinTeamSuccess?: JoinTeamSuccessResolvers<ContextType>;
  LoginError?: LoginErrorResolvers<ContextType>;
  LoginFailure?: LoginFailureResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  LoginSuccess?: LoginSuccessResolvers<ContextType>;
  MaxArenaReachedError?: MaxArenaReachedErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamNameAlreadyTakenError?: TeamNameAlreadyTakenErrorResolvers<ContextType>;
  TeamNotFoundError?: TeamNotFoundErrorResolvers<ContextType>;
  TeamOrDeletedTeam?: TeamOrDeletedTeamResolvers<ContextType>;
  Tournament?: TournamentResolvers<ContextType>;
  TournamentInvitation?: TournamentInvitationResolvers<ContextType>;
  UpdateTeamError?: UpdateTeamErrorResolvers<ContextType>;
  UpdateTeamFailure?: UpdateTeamFailureResolvers<ContextType>;
  UpdateTeamResult?: UpdateTeamResultResolvers<ContextType>;
  UpdateTeamSuccess?: UpdateTeamSuccessResolvers<ContextType>;
  UpdateTournamentConfigurationError?: UpdateTournamentConfigurationErrorResolvers<ContextType>;
  UpdateTournamentConfigurationFailure?: UpdateTournamentConfigurationFailureResolvers<ContextType>;
  UpdateTournamentConfigurationResult?: UpdateTournamentConfigurationResultResolvers<ContextType>;
  UpdateTournamentConfigurationSuccess?: UpdateTournamentConfigurationSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserNotPartOfAnyTeam?: UserNotPartOfAnyTeamResolvers<ContextType>;
  UserRegistrationResult?: UserRegistrationResultResolvers<ContextType>;
  UserTeamResult?: UserTeamResultResolvers<ContextType>;
  UsernameAlreadyTaken?: UsernameAlreadyTakenResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
};

