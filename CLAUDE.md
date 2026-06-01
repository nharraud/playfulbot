<!--
Root CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
-->
# Playfulbot project

## Project Overview

PlayfulBot is an open-source programming tournament platform for team building. It's a TypeScript monorepo with multiple services that communicate via GraphQL and gRPC.

## Architecture

Users interact with the platform in two ways:

- via the frontend in their browser.
- via their bots which:
  - connects to the Backend to get the list of games to play.
  - connects and Backend Game Runner services to play those games.

### Services

1. **Backend** (`/backend`) — Main backend process which is used to handle Tournaments, Teams, Users, Arenas.
2. **Backend Game Runner** (`/backend-game-runner`) — Ran as multiple parallel processes that execute games.
3. **Frontend** (`/frontend`) — React 19 + Vite + Apollo Client + React Router v7. i18n via react-intl/formatjs.
4. **Backend Commons** (`/backend-commons`) — Shared library with database models, migrations (SQL files in `/src`), and shared GraphQL resolvers.

### Game Packages (`/packages/`)

- `playfulbot-game` — Base game types/interfaces
- `playfulbot-game-backend` — Backend game logic
- `playfulbot-game-frontend` — Frontend game rendering (React)
- `playfulbot-wallrace` — The only game implementation (Three.js + React Three Fiber)
- `mem-pubsub` — In-memory pub/sub for real-time updates
- `playfulbot-config-loader` / `rollup-plugin-playfulbot-config-loader` — Runtime game config loading

### Service Communication

- Frontend ↔ Backend: GraphQL Yoga v5 (Apollo Client) + Express
- Frontend ↔ Game Runner: GraphQL Yoga v5 (Apollo Client) + Express
- Backend ↔ Game Client: gRPC (`.proto` files define the contract)
- Backend ↔ Game Runner: PostgreSQL for shared state
