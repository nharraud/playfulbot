import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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

export type CreateTeamError = ForbiddenError | ValidationError;

export type CreateTeamFailure = {
  __typename?: 'CreateTeamFailure';
  errors: Array<CreateTeamError>;
};

export type CreateTeamResult = CreateTeamSuccess | CreateTeamFailure;

export type CreateTeamSuccess = {
  __typename?: 'CreateTeamSuccess';
  team?: Maybe<Team>;
};


export type DebugArena = {
  __typename?: 'DebugArena';
  id?: Maybe<Scalars['ID']>;
  game?: Maybe<Scalars['ID']>;
};

export type DeletedTeam = {
  __typename?: 'DeletedTeam';
  teamID?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
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
  id?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
  canceled?: Maybe<Scalars['Boolean']>;
  players?: Maybe<Array<Maybe<Player>>>;
  initialState?: Maybe<Scalars['JSON']>;
  patches?: Maybe<Scalars['JSON']>;
};

export type GameCanceled = {
  __typename?: 'GameCanceled';
  gameID?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
};

export type GamePatch = {
  __typename?: 'GamePatch';
  patch?: Maybe<Scalars['JSON']>;
  gameID?: Maybe<Scalars['ID']>;
  version?: Maybe<Scalars['Int']>;
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

export type JoinTeamResult = JoinTeamSuccess | JoinTeamFailure;

export type JoinTeamSuccess = {
  __typename?: 'JoinTeamSuccess';
  oldTeam?: Maybe<TeamOrDeletedTeam>;
  newTeam?: Maybe<Team>;
};

export type LiveGame = Game | GamePatch | GameCanceled | PlayerConnection;

export type LivePlayer = Player | PlayerConnection;

export type LivePlayerGames = PlayerGames | NewPlayerGames;

export type LoginResult = {
  __typename?: 'LoginResult';
  user: User;
  token: Scalars['String'];
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

export type NewPlayerGames = {
  __typename?: 'NewPlayerGames';
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type Player = {
  __typename?: 'Player';
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
  connected?: Maybe<Scalars['Boolean']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  playerID?: Maybe<Scalars['ID']>;
  connected?: Maybe<Scalars['Boolean']>;
};

export type PlayerGames = {
  __typename?: 'PlayerGames';
  playerID?: Maybe<Scalars['ID']>;
  games?: Maybe<Array<Maybe<Scalars['ID']>>>;
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

export enum RoundStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED'
}

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

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  name: Scalars['String'];
  members?: Maybe<Array<Maybe<User>>>;
  tournament?: Maybe<Tournament>;
};

export type TeamInput = {
  name?: Maybe<Scalars['String']>;
};

export type TeamNotFoundError = Error & {
  __typename?: 'TeamNotFoundError';
  message: Scalars['String'];
  teamID?: Maybe<Scalars['ID']>;
};

export type TeamOrDeletedTeam = Team | DeletedTeam;

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

export enum TournamentRoleName {
  Admin = 'ADMIN'
}

export enum TournamentStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED'
}

export type UpdateTeamError = ForbiddenError | ValidationError;

export type UpdateTeamFailure = {
  __typename?: 'UpdateTeamFailure';
  errors: Array<UpdateTeamError>;
};

export type UpdateTeamResult = UpdateTeamSuccess | UpdateTeamFailure;

export type UpdateTeamSuccess = {
  __typename?: 'UpdateTeamSuccess';
  team?: Maybe<Team>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  teams?: Maybe<Array<Maybe<Team>>>;
  tournamentInvitations?: Maybe<Array<TournamentInvitation>>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CreateTeamError: ResolversTypes['ForbiddenError'] | ResolversTypes['ValidationError'];
  CreateTeamFailure: ResolverTypeWrapper<Omit<CreateTeamFailure, 'errors'> & { errors: Array<ResolversTypes['CreateTeamError']> }>;
  CreateTeamResult: ResolversTypes['CreateTeamSuccess'] | ResolversTypes['CreateTeamFailure'];
  CreateTeamSuccess: ResolverTypeWrapper<CreateTeamSuccess>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DebugArena: ResolverTypeWrapper<DebugArena>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  DeletedTeam: ResolverTypeWrapper<DeletedTeam>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Error: ResolversTypes['ForbiddenError'] | ResolversTypes['TeamNotFoundError'] | ResolversTypes['ValidationError'];
  ForbiddenError: ResolverTypeWrapper<ForbiddenError>;
  Game: ResolverTypeWrapper<Game>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  GameCanceled: ResolverTypeWrapper<GameCanceled>;
  GamePatch: ResolverTypeWrapper<GamePatch>;
  GameSummary: ResolverTypeWrapper<GameSummary>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JoinTeamError: ResolversTypes['TeamNotFoundError'];
  JoinTeamFailure: ResolverTypeWrapper<Omit<JoinTeamFailure, 'errors'> & { errors: Array<ResolversTypes['JoinTeamError']> }>;
  JoinTeamResult: ResolversTypes['JoinTeamSuccess'] | ResolversTypes['JoinTeamFailure'];
  JoinTeamSuccess: ResolverTypeWrapper<Omit<JoinTeamSuccess, 'oldTeam'> & { oldTeam?: Maybe<ResolversTypes['TeamOrDeletedTeam']> }>;
  LiveGame: ResolversTypes['Game'] | ResolversTypes['GamePatch'] | ResolversTypes['GameCanceled'] | ResolversTypes['PlayerConnection'];
  LivePlayer: ResolversTypes['Player'] | ResolversTypes['PlayerConnection'];
  LivePlayerGames: ResolversTypes['PlayerGames'] | ResolversTypes['NewPlayerGames'];
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  NewPlayerGames: ResolverTypeWrapper<NewPlayerGames>;
  Player: ResolverTypeWrapper<Player>;
  PlayerConnection: ResolverTypeWrapper<PlayerConnection>;
  PlayerGames: ResolverTypeWrapper<PlayerGames>;
  Query: ResolverTypeWrapper<{}>;
  Round: ResolverTypeWrapper<Round>;
  RoundStatus: RoundStatus;
  Subscription: ResolverTypeWrapper<{}>;
  Team: ResolverTypeWrapper<Team>;
  TeamInput: TeamInput;
  TeamNotFoundError: ResolverTypeWrapper<TeamNotFoundError>;
  TeamOrDeletedTeam: ResolversTypes['Team'] | ResolversTypes['DeletedTeam'];
  Tournament: ResolverTypeWrapper<Tournament>;
  TournamentInvitation: ResolverTypeWrapper<TournamentInvitation>;
  TournamentRoleName: TournamentRoleName;
  TournamentStatus: TournamentStatus;
  UpdateTeamError: ResolversTypes['ForbiddenError'] | ResolversTypes['ValidationError'];
  UpdateTeamFailure: ResolverTypeWrapper<Omit<UpdateTeamFailure, 'errors'> & { errors: Array<ResolversTypes['UpdateTeamError']> }>;
  UpdateTeamResult: ResolversTypes['UpdateTeamSuccess'] | ResolversTypes['UpdateTeamFailure'];
  UpdateTeamSuccess: ResolverTypeWrapper<UpdateTeamSuccess>;
  User: ResolverTypeWrapper<User>;
  UserNotPartOfAnyTeam: ResolverTypeWrapper<UserNotPartOfAnyTeam>;
  UserTeamResult: ResolversTypes['Team'] | ResolversTypes['UserNotPartOfAnyTeam'];
  ValidationError: ResolverTypeWrapper<ValidationError>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CreateTeamError: ResolversParentTypes['ForbiddenError'] | ResolversParentTypes['ValidationError'];
  CreateTeamFailure: Omit<CreateTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['CreateTeamError']> };
  CreateTeamResult: ResolversParentTypes['CreateTeamSuccess'] | ResolversParentTypes['CreateTeamFailure'];
  CreateTeamSuccess: CreateTeamSuccess;
  Date: Scalars['Date'];
  DebugArena: DebugArena;
  ID: Scalars['ID'];
  DeletedTeam: DeletedTeam;
  String: Scalars['String'];
  Error: ResolversParentTypes['ForbiddenError'] | ResolversParentTypes['TeamNotFoundError'] | ResolversParentTypes['ValidationError'];
  ForbiddenError: ForbiddenError;
  Game: Game;
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  GameCanceled: GameCanceled;
  GamePatch: GamePatch;
  GameSummary: GameSummary;
  JSON: Scalars['JSON'];
  JoinTeamError: ResolversParentTypes['TeamNotFoundError'];
  JoinTeamFailure: Omit<JoinTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['JoinTeamError']> };
  JoinTeamResult: ResolversParentTypes['JoinTeamSuccess'] | ResolversParentTypes['JoinTeamFailure'];
  JoinTeamSuccess: Omit<JoinTeamSuccess, 'oldTeam'> & { oldTeam?: Maybe<ResolversParentTypes['TeamOrDeletedTeam']> };
  LiveGame: ResolversParentTypes['Game'] | ResolversParentTypes['GamePatch'] | ResolversParentTypes['GameCanceled'] | ResolversParentTypes['PlayerConnection'];
  LivePlayer: ResolversParentTypes['Player'] | ResolversParentTypes['PlayerConnection'];
  LivePlayerGames: ResolversParentTypes['PlayerGames'] | ResolversParentTypes['NewPlayerGames'];
  LoginResult: LoginResult;
  Mutation: {};
  NewPlayerGames: NewPlayerGames;
  Player: Player;
  PlayerConnection: PlayerConnection;
  PlayerGames: PlayerGames;
  Query: {};
  Round: Round;
  Subscription: {};
  Team: Team;
  TeamInput: TeamInput;
  TeamNotFoundError: TeamNotFoundError;
  TeamOrDeletedTeam: ResolversParentTypes['Team'] | ResolversParentTypes['DeletedTeam'];
  Tournament: Tournament;
  TournamentInvitation: TournamentInvitation;
  UpdateTeamError: ResolversParentTypes['ForbiddenError'] | ResolversParentTypes['ValidationError'];
  UpdateTeamFailure: Omit<UpdateTeamFailure, 'errors'> & { errors: Array<ResolversParentTypes['UpdateTeamError']> };
  UpdateTeamResult: ResolversParentTypes['UpdateTeamSuccess'] | ResolversParentTypes['UpdateTeamFailure'];
  UpdateTeamSuccess: UpdateTeamSuccess;
  User: User;
  UserNotPartOfAnyTeam: UserNotPartOfAnyTeam;
  UserTeamResult: ResolversParentTypes['Team'] | ResolversParentTypes['UserNotPartOfAnyTeam'];
  ValidationError: ValidationError;
};

export type CreateTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamError'] = ResolversParentTypes['CreateTeamError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'ValidationError', ParentType, ContextType>;
};

export type CreateTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamFailure'] = ResolversParentTypes['CreateTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['CreateTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamResult'] = ResolversParentTypes['CreateTeamResult']> = {
  __resolveType: TypeResolveFn<'CreateTeamSuccess' | 'CreateTeamFailure', ParentType, ContextType>;
};

export type CreateTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTeamSuccess'] = ResolversParentTypes['CreateTeamSuccess']> = {
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DebugArenaResolvers<ContextType = any, ParentType extends ResolversParentTypes['DebugArena'] = ResolversParentTypes['DebugArena']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  game?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletedTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeletedTeam'] = ResolversParentTypes['DeletedTeam']> = {
  teamID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'TeamNotFoundError' | 'ValidationError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ForbiddenErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ForbiddenError'] = ResolversParentTypes['ForbiddenError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  canceled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  initialState?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  patches?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameCanceledResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameCanceled'] = ResolversParentTypes['GameCanceled']> = {
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GamePatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['GamePatch'] = ResolversParentTypes['GamePatch']> = {
  patch?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameSummary'] = ResolversParentTypes['GameSummary']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  losers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  winners?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JoinTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamError'] = ResolversParentTypes['JoinTeamError']> = {
  __resolveType: TypeResolveFn<'TeamNotFoundError', ParentType, ContextType>;
};

export type JoinTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamFailure'] = ResolversParentTypes['JoinTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['JoinTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JoinTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamResult'] = ResolversParentTypes['JoinTeamResult']> = {
  __resolveType: TypeResolveFn<'JoinTeamSuccess' | 'JoinTeamFailure', ParentType, ContextType>;
};

export type JoinTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamSuccess'] = ResolversParentTypes['JoinTeamSuccess']> = {
  oldTeam?: Resolver<Maybe<ResolversTypes['TeamOrDeletedTeam']>, ParentType, ContextType>;
  newTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LiveGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LiveGame'] = ResolversParentTypes['LiveGame']> = {
  __resolveType: TypeResolveFn<'Game' | 'GamePatch' | 'GameCanceled' | 'PlayerConnection', ParentType, ContextType>;
};

export type LivePlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['LivePlayer'] = ResolversParentTypes['LivePlayer']> = {
  __resolveType: TypeResolveFn<'Player' | 'PlayerConnection', ParentType, ContextType>;
};

export type LivePlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LivePlayerGames'] = ResolversParentTypes['LivePlayerGames']> = {
  __resolveType: TypeResolveFn<'PlayerGames' | 'NewPlayerGames', ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  play?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPlayArgs, 'gameID' | 'playerID' | 'action' | 'data'>>;
  createNewDebugGame?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateNewDebugGameArgs, 'tournamentID' | 'userID'>>;
  registerUser?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'username' | 'password'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'username' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationCreateTournamentArgs, 'name' | 'startDate' | 'lastRoundDate' | 'roundsNumber' | 'minutesBetweenRounds'>>;
  registerTournamentInvitationLink?: Resolver<Maybe<ResolversTypes['TournamentInvitation']>, ParentType, ContextType, RequireFields<MutationRegisterTournamentInvitationLinkArgs, 'tournamentInvitationLinkID'>>;
  createTeam?: Resolver<Maybe<ResolversTypes['CreateTeamResult']>, ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'tournamentID' | 'input' | 'join'>>;
  updateTeam?: Resolver<Maybe<ResolversTypes['UpdateTeamResult']>, ParentType, ContextType, RequireFields<MutationUpdateTeamArgs, 'teamID' | 'input'>>;
  joinTeam?: Resolver<Maybe<ResolversTypes['JoinTeamResult']>, ParentType, ContextType, RequireFields<MutationJoinTeamArgs, 'teamID'>>;
};

export type NewPlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewPlayerGames'] = ResolversParentTypes['NewPlayerGames']> = {
  games?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  connected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerConnection'] = ResolversParentTypes['PlayerConnection']> = {
  playerID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  connected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerGames'] = ResolversParentTypes['PlayerGames']> = {
  playerID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  games?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryTournamentArgs, never>>;
  tournamentByInvitationLink?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryTournamentByInvitationLinkArgs, 'tournamentInvitationLinkID'>>;
  round?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType, RequireFields<QueryRoundArgs, never>>;
  team?: Resolver<Maybe<ResolversTypes['UserTeamResult']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'userID' | 'tournamentID'>>;
  authenticatedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RoundResolvers<ContextType = any, ParentType extends ResolversParentTypes['Round'] = ResolversParentTypes['Round']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['RoundStatus']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  teamPoints?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teamGames?: Resolver<Maybe<Array<Maybe<ResolversTypes['GameSummary']>>>, ParentType, ContextType, RequireFields<RoundTeamGamesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  game?: SubscriptionResolver<Maybe<ResolversTypes['LiveGame']>, "game", ParentType, ContextType, RequireFields<SubscriptionGameArgs, 'gameID'>>;
  debugArena?: SubscriptionResolver<Maybe<ResolversTypes['DebugArena']>, "debugArena", ParentType, ContextType, RequireFields<SubscriptionDebugArenaArgs, 'userID' | 'tournamentID'>>;
  playerGames?: SubscriptionResolver<Maybe<ResolversTypes['LivePlayerGames']>, "playerGames", ParentType, ContextType, RequireFields<SubscriptionPlayerGamesArgs, 'playerID'>>;
  teamPlayer?: SubscriptionResolver<Maybe<ResolversTypes['LivePlayer']>, "teamPlayer", ParentType, ContextType, RequireFields<SubscriptionTeamPlayerArgs, 'teamID'>>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamNotFoundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamNotFoundError'] = ResolversParentTypes['TeamNotFoundError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamOrDeletedTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamOrDeletedTeam'] = ResolversParentTypes['TeamOrDeletedTeam']> = {
  __resolveType: TypeResolveFn<'Team' | 'DeletedTeam', ParentType, ContextType>;
};

export type TournamentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tournament'] = ResolversParentTypes['Tournament']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['TournamentStatus']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  lastRoundDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  firstRoundDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  roundsNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minutesBetweenRounds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teams?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  rounds?: Resolver<Maybe<Array<Maybe<ResolversTypes['Round']>>>, ParentType, ContextType, RequireFields<TournamentRoundsArgs, 'maxSize'>>;
  myRole?: Resolver<Maybe<ResolversTypes['TournamentRoleName']>, ParentType, ContextType>;
  invitationLinkID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TournamentInvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TournamentInvitation'] = ResolversParentTypes['TournamentInvitation']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  invitee?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTeamErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamError'] = ResolversParentTypes['UpdateTeamError']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'ValidationError', ParentType, ContextType>;
};

export type UpdateTeamFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamFailure'] = ResolversParentTypes['UpdateTeamFailure']> = {
  errors?: Resolver<Array<ResolversTypes['UpdateTeamError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamResult'] = ResolversParentTypes['UpdateTeamResult']> = {
  __resolveType: TypeResolveFn<'UpdateTeamSuccess' | 'UpdateTeamFailure', ParentType, ContextType>;
};

export type UpdateTeamSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTeamSuccess'] = ResolversParentTypes['UpdateTeamSuccess']> = {
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teams?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>;
  tournamentInvitations?: Resolver<Maybe<Array<ResolversTypes['TournamentInvitation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserNotPartOfAnyTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserNotPartOfAnyTeam'] = ResolversParentTypes['UserNotPartOfAnyTeam']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTeamResult'] = ResolversParentTypes['UserTeamResult']> = {
  __resolveType: TypeResolveFn<'Team' | 'UserNotPartOfAnyTeam', ParentType, ContextType>;
};

export type ValidationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CreateTeamError?: CreateTeamErrorResolvers<ContextType>;
  CreateTeamFailure?: CreateTeamFailureResolvers<ContextType>;
  CreateTeamResult?: CreateTeamResultResolvers<ContextType>;
  CreateTeamSuccess?: CreateTeamSuccessResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DebugArena?: DebugArenaResolvers<ContextType>;
  DeletedTeam?: DeletedTeamResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  ForbiddenError?: ForbiddenErrorResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  GameCanceled?: GameCanceledResolvers<ContextType>;
  GamePatch?: GamePatchResolvers<ContextType>;
  GameSummary?: GameSummaryResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JoinTeamError?: JoinTeamErrorResolvers<ContextType>;
  JoinTeamFailure?: JoinTeamFailureResolvers<ContextType>;
  JoinTeamResult?: JoinTeamResultResolvers<ContextType>;
  JoinTeamSuccess?: JoinTeamSuccessResolvers<ContextType>;
  LiveGame?: LiveGameResolvers<ContextType>;
  LivePlayer?: LivePlayerResolvers<ContextType>;
  LivePlayerGames?: LivePlayerGamesResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NewPlayerGames?: NewPlayerGamesResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerConnection?: PlayerConnectionResolvers<ContextType>;
  PlayerGames?: PlayerGamesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Round?: RoundResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamNotFoundError?: TeamNotFoundErrorResolvers<ContextType>;
  TeamOrDeletedTeam?: TeamOrDeletedTeamResolvers<ContextType>;
  Tournament?: TournamentResolvers<ContextType>;
  TournamentInvitation?: TournamentInvitationResolvers<ContextType>;
  UpdateTeamError?: UpdateTeamErrorResolvers<ContextType>;
  UpdateTeamFailure?: UpdateTeamFailureResolvers<ContextType>;
  UpdateTeamResult?: UpdateTeamResultResolvers<ContextType>;
  UpdateTeamSuccess?: UpdateTeamSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserNotPartOfAnyTeam?: UserNotPartOfAnyTeamResolvers<ContextType>;
  UserTeamResult?: UserTeamResultResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
