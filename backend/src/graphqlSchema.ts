import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  type User {
    id: ID!
    username: String!
  }

  type LoginResult {
    user: User!
    token: String!
  }

  type PlayerAssignment {
    playerID: String!
    playerNumber: Int!
  }

  type Game {
    id: ID
    version: Int!
    assignments: [PlayerAssignment!]!
    gameState: JSON!
  }

  type GamePatch {
    patch: JSON!
    gameID: ID!
    version: Int!
  }

  type Mutation {
    play(gameID: ID!, playerID: ID!, action: String!, data: JSON!): Boolean
    createNewDebugGame: GameSchedule

    login(username: String!, password: String!): LoginResult
    logout: Boolean
  }

  type Player {
    id: String
    token: String
  }

  type GameSchedule {
    id: ID!
    players: [Player]
    game: Game
  }

  type Subscription {
    gamePatch(gameID: ID!): GamePatch
    gameScheduleChanges(scheduleID: ID!): GameSchedule
  }

  type Query {
    game(gameID: ID): Game
    debugGame(userID: ID!): GameSchedule
    gameSchedule(scheduleID: ID!): GameSchedule
    authenticatedUser: User
  }
`;

export default typeDefs;
