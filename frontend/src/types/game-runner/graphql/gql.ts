/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  subscription game($gameID: ID!) {\n    game(gameID: $gameID) {\n\n      ... on GamePatch {\n        gameID, version, patch, winners\n      }\n      ... on Game {\n        id\n        canceled\n        version\n        players {\n          id, token, connected\n        }\n        winners\n        initialState\n        patches\n      }\n      ... on GameCanceled {\n        gameID,\n        version\n      }\n      # ... on PlayerConnection {\n      #   playerID\n      #   connected\n      # }\n    }\n  }\n": typeof types.GameDocument,
};
const documents: Documents = {
    "\n  subscription game($gameID: ID!) {\n    game(gameID: $gameID) {\n\n      ... on GamePatch {\n        gameID, version, patch, winners\n      }\n      ... on Game {\n        id\n        canceled\n        version\n        players {\n          id, token, connected\n        }\n        winners\n        initialState\n        patches\n      }\n      ... on GameCanceled {\n        gameID,\n        version\n      }\n      # ... on PlayerConnection {\n      #   playerID\n      #   connected\n      # }\n    }\n  }\n": types.GameDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription game($gameID: ID!) {\n    game(gameID: $gameID) {\n\n      ... on GamePatch {\n        gameID, version, patch, winners\n      }\n      ... on Game {\n        id\n        canceled\n        version\n        players {\n          id, token, connected\n        }\n        winners\n        initialState\n        patches\n      }\n      ... on GameCanceled {\n        gameID,\n        version\n      }\n      # ... on PlayerConnection {\n      #   playerID\n      #   connected\n      # }\n    }\n  }\n"): (typeof documents)["\n  subscription game($gameID: ID!) {\n    game(gameID: $gameID) {\n\n      ... on GamePatch {\n        gameID, version, patch, winners\n      }\n      ... on Game {\n        id\n        canceled\n        version\n        players {\n          id, token, connected\n        }\n        winners\n        initialState\n        patches\n      }\n      ... on GameCanceled {\n        gameID,\n        version\n      }\n      # ... on PlayerConnection {\n      #   playerID\n      #   connected\n      # }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;