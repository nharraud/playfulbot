import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  type User {
    id: ID
    username: String
  }

  type LoginResult {
    user: User
    token: String
  }

  type Player {
    playerNumber: Int!
    user: User!
    token: String
  }

  type Game {
    id: ID
    version: Int!
    players: [Player!]!
    gameState: JSON!
  }

  type GamePatch {
    patch: JSON!
    gameID: ID!
    version: Int!
  }

  type Mutation {
    play(gameID: ID!, player: Int!, action: String!, data: JSON!): Boolean
    createNewDebugGame: DebugGame

    login(username: String!, password: String!): LoginResult
    logout: Boolean
  }

  type DebugGame {
    id: ID!
    game: Game
  }

  type Subscription {
    gamePatch(gameID: ID!): GamePatch
    debugGameChanges: DebugGame
  }

  type Query {
    game(gameID: ID): Game
    debugGame: DebugGame
    authenticatedUser: User
  }
`;

export default typeDefs;
