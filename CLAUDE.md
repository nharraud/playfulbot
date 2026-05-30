<!--
CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
-->

## Project Overview

PlayfulBot is an open-source programming tournament platform for team building. It's a TypeScript monorepo with multiple services that communicate via GraphQL and gRPC.

## Commands

### Full Stack
```bash
docker-compose -f docker/docker-compose.yml up   # Start all services
docker-compose -f docker/dev/docker-compose.yml up  # Dev stack
```

### Backend (`/backend`)
```bash
npm run dev          # Run built version
npm run debug        # Nodemon + inspector on port 9228
npm run build        # Compile TypeScript
npm run test         # Run vitest tests
npm run lint         # ESLint
npm run lint-fix     # Auto-fix lint issues
npm run typecheck    # tsc --noEmit
npm run gen-graphql  # Regenerate GraphQL types from schema
npm run gen-grpc     # Regenerate gRPC types from .proto files
```

### Backend Game Runner (`/backend-game-runner`)
```bash
npm run debug        # Nodemon + inspector on port 9229 (separate from backend)
npm run test         # Run vitest tests
```

### Frontend (`/frontend`)
```bash
npm run dev                   # Vite dev server
npm run build                 # Production build
npm run gen-graphql-backend   # Watch mode codegen for backend schema
npm run gen-graphql-runner    # Watch mode codegen for game-runner schema
npm run intl-extract          # Extract i18n messages
npm run intl-compile          # Compile i18n messages
```

### Backend Commons (`/backend-commons`)
```bash
npm run build        # Compile TypeScript (also copies SQL files to /lib)
npm run build:watch  # Watch mode
```

### Running Tests
The Vitest workspace at `/vitest.workspace.ts` covers `backend`, `backend-game-runner`, and `packages/mem-pubsub`. Run tests per package with `npm test` in each directory.

## Architecture

### Services
1. **Backend** (`/backend`) — Express + GraphQL Yoga v5 API server + gRPC server for game scheduling. Port 5000 (GraphQL). PostgreSQL via pg-promise.
2. **Backend Game Runner** (`/backend-game-runner`) — Separate process that executes games. Apollo Server + GraphQL + gRPC. Holds max 3 games in memory. Communicates with backend via PostgreSQL.
3. **Frontend** (`/frontend`) — React 19 + Vite + Apollo Client + Material-UI 7 + React Router v7. i18n via react-intl/formatjs.
4. **Backend Commons** (`/backend-commons`) — Shared library with database models, migrations (SQL files in `/src`), and shared GraphQL resolvers.

### Game Packages (`/packages/`)
- `playfulbot-game` — Base game types/interfaces
- `playfulbot-game-backend` — Backend game logic
- `playfulbot-game-frontend` — Frontend game rendering (React)
- `playfulbot-wallrace` — The only game implementation (Three.js + React Three Fiber)
- `mem-pubsub` — In-memory pub/sub for real-time updates
- `playfulbot-config-loader` / `rollup-plugin-playfulbot-config-loader` — Runtime game config loading

### Service Communication
- Frontend ↔ Backend: GraphQL (Apollo Client)
- Backend ↔ Game Runner: gRPC (`.proto` files define the contract) + PostgreSQL for shared state
- Games loaded via `/game-config.json` (path set by `PLAYFULBOT_CONFIG` env var)

### Backend Internal Structure
```
backend/src/
  core/          # Use cases, entities (domain layer)
  model/         # Legacy code. Currently being refactored. Do not use or edit code in this directory
  infrastructure/
    graphql/     # GraphQL resolvers and schema
    grpc/        # gRPC server and handlers
    providers/   # DI providers
  games/         # Game-specific backend logic
  scheduling/    # Tournament/game scheduling
```

### Database
- PostgreSQL (port 5431 for dev via Docker, 5431 for test DB)
- Migrations in `backend-commons/src/model` as SQL files
- SQL files are copied to `/lib` during the build step — always run `npm run build` in `backend-commons` before running backend tests
- Test DB: `playfulbot_test` (separate from `playfulbot` dev DB)

### Environment Variables
Key env vars (use dotenv-flow; `.env`, `.env.development`, `.env.test`):
- `PLAYFULBOT_CONFIG` — Path to `game-config.json` (required for all services)
- `DATABASE_*` — PostgreSQL credentials
- `SECRET_KEY` — JWT signing
- `GRAPHQL_PORT` / `GRPC_PORT` — Ports (use `0` for auto-select in tests)
- `VITE_API_*` — Frontend API endpoints
- `TZ` / `PGTZ` — Set to UTC/GMT

### VS Code Debugging
`.vscode/launch.json` defines attach configs for Chrome, Backend (port 9228), and Game Runner (port 9229).

## Key Conventions
- Each package has its own `tsconfig.json` with path aliases (`~playfulbot/`, `src/*`)
- GraphQL types are generated — after schema changes, run `npm run gen-graphql` (backend) or `npm run gen-graphql-backend/runner` (frontend)
- gRPC types are generated — after `.proto` changes, run `npm run gen-grpc` in backend
- The `backend-commons` package must be built before running backend or game runner
