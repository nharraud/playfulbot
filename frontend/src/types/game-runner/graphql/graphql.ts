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

export type Game = {
  __typename: 'Game';
  canceled: Maybe<Scalars['Boolean']['output']>;
  id: Maybe<Scalars['ID']['output']>;
  initialState: Maybe<Scalars['JSON']['output']>;
  patches: Maybe<Scalars['JSON']['output']>;
  players: Maybe<Array<Maybe<Player>>>;
  version: Maybe<Scalars['Int']['output']>;
  winners: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};

export type GameCanceled = {
  __typename: 'GameCanceled';
  gameID: Maybe<Scalars['ID']['output']>;
  version: Maybe<Scalars['Int']['output']>;
};

export type GamePatch = {
  __typename: 'GamePatch';
  gameID: Maybe<Scalars['ID']['output']>;
  patch: Maybe<Scalars['JSON']['output']>;
  version: Maybe<Scalars['Int']['output']>;
  winners: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};

export type LiveGame = Game | GameCanceled | GamePatch | PlayerConnection;

export type Mutation = {
  __typename: 'Mutation';
  play: Maybe<Scalars['Boolean']['output']>;
};


export type MutationPlayArgs = {
  data: Scalars['JSON']['input'];
  gameID: Scalars['ID']['input'];
  playerID: Scalars['ID']['input'];
};

export type Player = {
  __typename: 'Player';
  connected: Maybe<Scalars['Boolean']['output']>;
  id: Maybe<Scalars['ID']['output']>;
  token: Maybe<Scalars['String']['output']>;
};

export type PlayerConnection = {
  __typename: 'PlayerConnection';
  connected: Maybe<Scalars['Boolean']['output']>;
  playerID: Maybe<Scalars['ID']['output']>;
};

export type Query = {
  __typename: 'Query';
  ping: Maybe<Scalars['Boolean']['output']>;
};

export type Subscription = {
  __typename: 'Subscription';
  game: Maybe<LiveGame>;
};


export type SubscriptionGameArgs = {
  gameID: Scalars['ID']['input'];
};

export type GameSubscriptionVariables = Exact<{
  gameID: Scalars['ID']['input'];
}>;


export type GameSubscription = { game:
    | { __typename: 'Game', id: string | null, canceled: boolean | null, version: number | null, winners: Array<number | null> | null, initialState: unknown | null, patches: unknown | null, players: Array<{ __typename: 'Player', id: string | null, token: string | null, connected: boolean | null } | null> | null }
    | { __typename: 'GameCanceled', gameID: string | null, version: number | null }
    | { __typename: 'GamePatch', gameID: string | null, version: number | null, patch: unknown | null, winners: Array<number | null> | null }
    | { __typename: 'PlayerConnection' }
   | null };

export type GameCancelFragment = { __typename: 'Game', version: number | null, canceled: boolean | null } & { ' $fragmentName'?: 'GameCancelFragment' };

export type GameFragment = { __typename: 'Game', id: string | null, version: number | null, canceled: boolean | null, winners: Array<number | null> | null, initialState: unknown | null, patches: unknown | null, players: Array<{ __typename: 'Player', id: string | null, token: string | null, connected: boolean | null } | null> | null } & { ' $fragmentName'?: 'GameFragment' };

export type GamePatchFragment = { __typename: 'Game', version: number | null, patches: unknown | null, winners: Array<number | null> | null } & { ' $fragmentName'?: 'GamePatchFragment' };

export const GameCancelFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameCancel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}}]}}]} as unknown as DocumentNode<GameCancelFragment, unknown>;
export const GameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"connected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"winners"}},{"kind":"Field","name":{"kind":"Name","value":"initialState"}},{"kind":"Field","name":{"kind":"Name","value":"patches"}}]}}]} as unknown as DocumentNode<GameFragment, unknown>;
export const GamePatchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GamePatch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"patches"}},{"kind":"Field","name":{"kind":"Name","value":"winners"}}]}}]} as unknown as DocumentNode<GamePatchFragment, unknown>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GamePatch"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameID"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"patch"}},{"kind":"Field","name":{"kind":"Name","value":"winners"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"connected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"winners"}},{"kind":"Field","name":{"kind":"Name","value":"initialState"}},{"kind":"Field","name":{"kind":"Name","value":"patches"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GameCanceled"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameID"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]}}]} as unknown as DocumentNode<GameSubscription, GameSubscriptionVariables>;