<!-- frontend CLAUDE.md -->

# Frontend

Web frontend to create, configure and participate to tournaments.

## Tech stack

GraphQL (Apollo Client).
Forms done via zod.

### Legacy stack (being replaced)

Legacy forms use react-hook-form and yup.

## Architecture

The frontend uses two different Apollo client connections for Backend and game runner queries.
Game runner connections are closed and open when a specific game is monitored.

### Code structure

Code is organized following CLEAN architecture, i.e. code is organized in layers. Each layer can only import code from lower levels.

```
lang/                       # translations to edit.
src/
  assets/                   # images and icons
  hooksAndQueries/          # Graphql queries
    backend/graphql/        # queries specific to backend
    game-runner/graphql/    # queries specific to game runners
  i18n/                     
    lang/                   # compiled translations. Do not edit.
    I18nProvider            # translation provider
  infrastructure/graphql/   # Graphql client, react context/providers and cache
  types/                    # types generated from graphql schemas (in backend and game runner directories)
  ui/                       # UI
    components/             # generic components (modal, button, forms, etc...)
    Theme.module.css        # Theme styles
  utils/                    # Legacy utils
  App.tsx                   # Root React app
  App.module.tsx            # top styling variables
```

There are no real tests at this time for frontend code.

Note that we are in a cleaning phase so a lot of code is actually dead code. Ask before using code as reference.

## Conventions

### Graphql queries

Legacy queries were written in a separate .graphql file. Now queries are written in a ts file using the following pattern:

```ts
import { graphql } from 'src/types/backend/graphql/gql';
// Query definition
const getAuthenticatedUserQuery = graphql(`
  query getAuthenticatedUser {
    authenticatedUser { id, username }
  }
`)

// React hook using the query
export function useAuthenticatedUser() {
  const client = useContext(BackendClientContext);

  const { error, data } = useQuery(
    getAuthenticatedUserQuery,
    {
      skip: localStorage.getItem('token') === null,
      client
    }
  );

  return { authenticatedUser: data ? data.authenticatedUser : null };
}
```

use `import { graphql } from '../../../types/game-runner/graphql'` for game runner queries.

### Styling

Styling is done via CSS module files which are located next to the corresponding React component file. Example: "TournamentPage.tsx" and "TournamentPage.module.css".
A file named "TournamentPage.module.css.d.ts" is automatically generated just for convenience.

App.module.css defines, using CSS variables, all colors, font size, font weight, etc...
Theme.module.css use the generic color variables to associate them to specific components.

UI components reference use the variables defined in Theme.module.css and App.module.css.

Margin, padding, width, height and other spacings are defined using the following pattern: `padding: calc(var(--spacing) * 2);`. The multiplier changing. `--spacing` is defined in App.module.css.

### UI generic components

There is as little TS code as possible in generic components. When the component has no behaviour but only a specific aspect, only a CSS module file is present.

### Import

Import path use the alias `"src/*": ["./src/*"]`.
