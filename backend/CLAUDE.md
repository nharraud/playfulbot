<!-- Backend CLAUDE.md -->

# Backend

## Tech stack

Express + GraphQL Yoga v5 API server + gRPC server for game scheduling. PostgreSQL via pg-promise.

### Configuration

- Games loaded via `/game-config.json` (path set by `PLAYFULBOT_CONFIG` env var)

### Code structure

Code is organized following CLEAN architecture, i.e. code is organized in layers. Each layer can only import code from lower levels.

```
src/
  core/
    entities/        # Lowest layer. Mainly Abstractions. It imports no other backend code.
    use-cases/       # Middle layer. Depends only on "entities". Implements backend core logic.
      interfaces/    # Interfaces used to expose "infrastructure" to use-cases.
  infrastructure/    # Highest layer. Depends on "core" code.
    graphql/         # GraphQL resolvers and schema
    grpc/            # gRPC server and handlers
    providers/       # Providers used to interact with the database, loading games, and any other infrastructure service when they are added.
  games/             # Game-specific backend logic
  scheduling/        # Tournament/game scheduling.
  cli.ts             # CLI code used to run commands (init/delete db, load demo, start backend)
  model/             # Legacy code. Currently being refactored. Do not use or edit code in this directory
tests/
  integration-tests  # test the whole chain from graphql/grpc API to backend
  unit-tests         # test components independently.
```

## Conventions

### Requests

Each request starts a new database transaction.

### Use cases

Every use case takes as first argument a Context ("backend/src/core/use-cases/interfaces/Context") as first argument. It is an abstraction providing access to all infrastructure providers.

### Providers

Each entity created in the database has its own provider.
Providers interacting with the database get in each function the a ContextPSQL ("backend/src/infrastructure/providers/ContextPSQL.ts") as first argument.

### Import

Import path use the alias `"~playfulbot/*": ["src/*"]`

## Ongoing work

Code in "model" and "scheduling" directories is being refactored and cleaned.
Tournament rounds and scoring are not working yet.

## Commands

```bash
npm run test         # Run vitest tests
npm run lint         # ESLint
npm run lint-fix     # Auto-fix lint issues
npm run typecheck    # tsc --noEmit
npm run gen-graphql  # Regenerate GraphQL types from schema
npm run gen-grpc     # Regenerate gRPC types from .proto files
```
