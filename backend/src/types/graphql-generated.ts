import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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

export type LiveGame = Game | GamePatch | GameCanceled;

export type Player = {
  __typename?: 'Player';
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
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
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tournament: ResolverTypeWrapper<Tournament>;
  Team: ResolverTypeWrapper<Team>;
  UserNotPartOfAnyTeam: ResolverTypeWrapper<UserNotPartOfAnyTeam>;
  UserTeamResult: ResolversTypes['Team'] | ResolversTypes['UserNotPartOfAnyTeam'];
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Game: ResolverTypeWrapper<Game>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  GamePatch: ResolverTypeWrapper<GamePatch>;
  GameCanceled: ResolverTypeWrapper<GameCanceled>;
  LiveGame: ResolversTypes['Game'] | ResolversTypes['GamePatch'] | ResolversTypes['GameCanceled'];
  Player: ResolverTypeWrapper<Player>;
  DebugArena: ResolverTypeWrapper<DebugArena>;
  PlayerGames: ResolverTypeWrapper<PlayerGames>;
  NewPlayerGames: ResolverTypeWrapper<NewPlayerGames>;
  LivePlayerGames: ResolversTypes['PlayerGames'] | ResolversTypes['NewPlayerGames'];
  Subscription: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  JSON: Scalars['JSON'];
  User: User;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Tournament: Tournament;
  Team: Team;
  UserNotPartOfAnyTeam: UserNotPartOfAnyTeam;
  UserTeamResult: ResolversParentTypes['Team'] | ResolversParentTypes['UserNotPartOfAnyTeam'];
  LoginResult: LoginResult;
  Game: Game;
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  GamePatch: GamePatch;
  GameCanceled: GameCanceled;
  LiveGame: ResolversParentTypes['Game'] | ResolversParentTypes['GamePatch'] | ResolversParentTypes['GameCanceled'];
  Player: Player;
  DebugArena: DebugArena;
  PlayerGames: PlayerGames;
  NewPlayerGames: NewPlayerGames;
  LivePlayerGames: ResolversParentTypes['PlayerGames'] | ResolversParentTypes['NewPlayerGames'];
  Subscription: {};
  Query: {};
  Mutation: {};
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TournamentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tournament'] = ResolversParentTypes['Tournament']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserNotPartOfAnyTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserNotPartOfAnyTeam'] = ResolversParentTypes['UserNotPartOfAnyTeam']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTeamResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTeamResult'] = ResolversParentTypes['UserTeamResult']> = {
  __resolveType: TypeResolveFn<'Team' | 'UserNotPartOfAnyTeam', ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  canceled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  gameState?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GamePatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['GamePatch'] = ResolversParentTypes['GamePatch']> = {
  patch?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameCanceledResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameCanceled'] = ResolversParentTypes['GameCanceled']> = {
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LiveGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LiveGame'] = ResolversParentTypes['LiveGame']> = {
  __resolveType: TypeResolveFn<'Game' | 'GamePatch' | 'GameCanceled', ParentType, ContextType>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DebugArenaResolvers<ContextType = any, ParentType extends ResolversParentTypes['DebugArena'] = ResolversParentTypes['DebugArena']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  game?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerGames'] = ResolversParentTypes['PlayerGames']> = {
  playerID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  games?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NewPlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewPlayerGames'] = ResolversParentTypes['NewPlayerGames']> = {
  games?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LivePlayerGamesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LivePlayerGames'] = ResolversParentTypes['LivePlayerGames']> = {
  __resolveType: TypeResolveFn<'PlayerGames' | 'NewPlayerGames', ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  game?: SubscriptionResolver<Maybe<ResolversTypes['LiveGame']>, "game", ParentType, ContextType, RequireFields<SubscriptionGameArgs, 'gameID'>>;
  debugArena?: SubscriptionResolver<Maybe<ResolversTypes['DebugArena']>, "debugArena", ParentType, ContextType, RequireFields<SubscriptionDebugArenaArgs, 'userID' | 'tournamentID'>>;
  playerGames?: SubscriptionResolver<Maybe<ResolversTypes['LivePlayerGames']>, "playerGames", ParentType, ContextType, RequireFields<SubscriptionPlayerGamesArgs, 'playerID'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryTournamentArgs, never>>;
  team?: Resolver<Maybe<ResolversTypes['UserTeamResult']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'userID' | 'tournamentID'>>;
  authenticatedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  play?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPlayArgs, 'gameID' | 'playerID' | 'action' | 'data'>>;
  createNewDebugGame?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateNewDebugGameArgs, 'tournamentID' | 'userID'>>;
  registerUser?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'username' | 'password'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'username' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationCreateTournamentArgs, 'name'>>;
};

export type Resolvers<ContextType = any> = {
  JSON?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Tournament?: TournamentResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  UserNotPartOfAnyTeam?: UserNotPartOfAnyTeamResolvers<ContextType>;
  UserTeamResult?: UserTeamResultResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  GamePatch?: GamePatchResolvers<ContextType>;
  GameCanceled?: GameCanceledResolvers<ContextType>;
  LiveGame?: LiveGameResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  DebugArena?: DebugArenaResolvers<ContextType>;
  PlayerGames?: PlayerGamesResolvers<ContextType>;
  NewPlayerGames?: NewPlayerGamesResolvers<ContextType>;
  LivePlayerGames?: LivePlayerGamesResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
