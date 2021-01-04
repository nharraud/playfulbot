import {
  gql
} from 'apollo-server-koa';

export const typeDefs = gql`
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

scalar JSON

type User {
  id: ID,
  username: String
}

type LoginResult {
  user: User,
  token: String
}

type Player {
  playerNumber: Int!
  user: User!
  token: String,
}

type Game {
  id: ID
  players: [Player!]!
  gameState: JSON!
}

type Mutation {
  play(action: String!, data: JSON!): JSON
  login(username: String!, password: String!): LoginResult
  logout: Boolean
}

type Subscription {
  gamePatch(gameID: ID!): JSON
}

type Query {
  game(gameID: ID): Game
  debugGame: Game
  authenticatedUser: User
}
`;
