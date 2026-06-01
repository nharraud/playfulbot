<!-- backend-game-runner CLAUDE.md -->

# Backend Game-Runner

Run games in memory.
Each game runner has a limit of games it can run simultaneously.
Games are fetched from the database.

## Tech stack

Apollo Server + GraphQL + gRPC. Holds games in memory.
Communicates with backend via PostgreSQL.

### Code structure

Code is organized following CLEAN architecture, i.e. code is organized in layers. Each layer can only import code from lower levels.

```
src/
  core/
    entities/        # Lowest layer. Mainly Abstractions. It imports no other backend code.
    use-cases/       # Middle layer. Depends only on "entities". Implements backend core logic.
  infrastructure/    # Highest layer. Depends on "core" code.
    graphql/         # GraphQL resolvers and schema
    grpc/            # gRPC server and handlers
    games/           # Providers to fetch games from database and load game definitions from configuration
tests
  integration-tests  # test the whole chain from graphql/grpc API to backend
  unit-tests         # test components independently.
```

## Conventions

### Import

Import path use the alias `"~game-runner/*": ["src/*"]`.

## Commands

```bash
npm run test         # Run vitest tests
```
