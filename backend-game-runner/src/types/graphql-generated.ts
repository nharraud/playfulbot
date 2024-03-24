import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type LiveGame = Game | GameCanceled | GamePatch | PlayerConnection;

export type Mutation = {
  __typename?: 'Mutation';
  play?: Maybe<Scalars['Boolean']>;
};


export type MutationPlayArgs = {
  data: Scalars['JSON'];
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
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

export type Query = {
  __typename?: 'Query';
  ping?: Maybe<Scalars['Boolean']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  game?: Maybe<LiveGame>;
};


export type SubscriptionGameArgs = {
  gameID: Scalars['ID'];
};

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  message: Scalars['String'];
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

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Error: ResolversTypes['ForbiddenError'] | ResolversTypes['ValidationError'];
  ForbiddenError: ResolverTypeWrapper<ForbiddenError>;
  Game: ResolverTypeWrapper<Game>;
  GameCanceled: ResolverTypeWrapper<GameCanceled>;
  GamePatch: ResolverTypeWrapper<GamePatch>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LiveGame: ResolversTypes['Game'] | ResolversTypes['GameCanceled'] | ResolversTypes['GamePatch'] | ResolversTypes['PlayerConnection'];
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  PlayerConnection: ResolverTypeWrapper<PlayerConnection>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  Error: ResolversParentTypes['ForbiddenError'] | ResolversParentTypes['ValidationError'];
  ForbiddenError: ForbiddenError;
  Game: Game;
  GameCanceled: GameCanceled;
  GamePatch: GamePatch;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LiveGame: ResolversParentTypes['Game'] | ResolversParentTypes['GameCanceled'] | ResolversParentTypes['GamePatch'] | ResolversParentTypes['PlayerConnection'];
  Mutation: {};
  Player: Player;
  PlayerConnection: PlayerConnection;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  ValidationError: ValidationError;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  __resolveType: TypeResolveFn<'ForbiddenError' | 'ValidationError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ForbiddenErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ForbiddenError'] = ResolversParentTypes['ForbiddenError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  canceled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  initialState?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  patches?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  winners?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameCanceledResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameCanceled'] = ResolversParentTypes['GameCanceled']> = {
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GamePatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['GamePatch'] = ResolversParentTypes['GamePatch']> = {
  gameID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  patch?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  winners?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LiveGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LiveGame'] = ResolversParentTypes['LiveGame']> = {
  __resolveType: TypeResolveFn<'Game' | 'GameCanceled' | 'GamePatch' | 'PlayerConnection', ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  play?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPlayArgs, 'data' | 'gameID' | 'playerID'>>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  connected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerConnection'] = ResolversParentTypes['PlayerConnection']> = {
  connected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  playerID?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  ping?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  game?: SubscriptionResolver<Maybe<ResolversTypes['LiveGame']>, "game", ParentType, ContextType, RequireFields<SubscriptionGameArgs, 'gameID'>>;
};

export type ValidationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  ForbiddenError?: ForbiddenErrorResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  GameCanceled?: GameCanceledResolvers<ContextType>;
  GamePatch?: GamePatchResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LiveGame?: LiveGameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerConnection?: PlayerConnectionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
};

