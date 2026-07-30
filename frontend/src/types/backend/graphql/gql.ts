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
    "\n  query GetTeamArenas($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        arenas {\n          id\n          name\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n": typeof types.GetTeamArenasDocument,
    "\n  query Arena($arenaID: ID!) {\n    arena(arenaID: $arenaID) {\n      ... on ArenaSuccess {\n        arena {\n          id\n          name\n          players {\n            token\n          }\n        }\n      }\n      ... on ArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.ArenaDocument,
    "\n  mutation createArena($teamID: ID!, $name: String!) {\n    createArena(teamID: $teamID, name: $name) {\n      ... on CreateArenaSuccess {\n        arena {\n          id\n          name\n        }\n      }\n      ... on CreateArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.CreateArenaDocument,
    "\n  mutation deleteArena($arenaID: ID!) {\n    deleteArena(arenaID: $arenaID) {\n      ... on DeleteArenaSuccess {\n        arenaID\n      }\n      ... on DeleteArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.DeleteArenaDocument,
    "\n  query getAuthenticatedUser {\n    authenticatedUser { id, username }\n  }\n": typeof types.GetAuthenticatedUserDocument,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on LoginSuccess {\n        user {\n            id, username\n        }\n        token\n      }\n      ... on LoginFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation logout {\n    logout\n}": typeof types.LogoutDocument,
    "\n  query authenticatedUserTournaments {\n    authenticatedUser {\n      id,\n      username,\n      teams {\n        id,\n        name,\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      tournamentInvitations {\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      organizedTournaments {\n        id,\n        name,\n        # lastRoundDate,\n        status,\n      }\n    }\n  }\n": typeof types.AuthenticatedUserTournamentsDocument,
    "\n  query GetTeam($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n": typeof types.GetTeamDocument,
    "\n  mutation createTeam($tournamentID: ID!, $input: TeamInput!) {\n    createTeam(tournamentID: $tournamentID, input: $input) {\n      ... on CreateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on CreateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.CreateTeamDocument,
    "\n  mutation updateTeam($teamID: ID!, $input: TeamInput!) {\n    updateTeam(teamID: $teamID, input: $input) {\n      ... on UpdateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on UpdateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.UpdateTeamDocument,
    "\n  mutation joinTeam($teamID: ID!) {\n      joinTeam(teamID: $teamID) {\n          ... on JoinTeamSuccess {\n            newTeam {\n              id\n            }\n          }\n          ... on JoinTeamFailure {\n            errors {\n              ... on TeamNotFoundError {\n                teamID\n                message\n              }\n              ... on Error {\n                message\n              }\n            }\n          }\n      }\n  }\n": typeof types.JoinTeamDocument,
    "\n  query tournamentTeams($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      teams {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n    }\n  }\n": typeof types.TournamentTeamsDocument,
    "\n  mutation createTournament(\n    $name: String!,\n    $startDate: Date!,\n    $endDate: Date!,\n  ) {\n    createTournament(\n      name: $name\n      startDate: $startDate,\n      endDate: $endDate,\n    ) {\n      id\n      name\n    }\n  }\n": typeof types.CreateTournamentDocument,
    "\n  mutation updateTournamentConfiguration($tournamentID: ID!, $input: TournamentConfigurationInput!) {\n    updateTournamentConfiguration(tournamentID: $tournamentID, input: $input) {\n      ... on UpdateTournamentConfigurationSuccess {\n        tournament {\n          id\n          name\n          startDate\n          endDate\n        }\n      }\n      ... on UpdateTournamentConfigurationFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.UpdateTournamentConfigurationDocument,
    "\n  subscription arenaGames($arenaID: ID!) {\n    arenaGames(arenaID: $arenaID) {\n      ... on GameRef {\n        gameID,\n        graphqlUrl,\n      }\n      ... on ArenaGamesFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.ArenaGamesDocument,
    "\n  mutation createArenaGame($arenaID: ID!) {\n    createArenaGame(arenaID: $arenaID) {\n      ... on CreateArenaGameSuccess {\n        gameID\n      }\n      ... on CreateArenaGameFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": typeof types.CreateArenaGameDocument,
    "\n  query tournament($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      name\n      status\n      startDate\n      endDate\n      # firstRoundDate\n      # lastRoundDate\n      # roundsNumber\n      # minutesBetweenRounds\n      myRole\n      # invitationLinkID\n    }\n  }\n": typeof types.TournamentDocument,
};
const documents: Documents = {
    "\n  query GetTeamArenas($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        arenas {\n          id\n          name\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n": types.GetTeamArenasDocument,
    "\n  query Arena($arenaID: ID!) {\n    arena(arenaID: $arenaID) {\n      ... on ArenaSuccess {\n        arena {\n          id\n          name\n          players {\n            token\n          }\n        }\n      }\n      ... on ArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.ArenaDocument,
    "\n  mutation createArena($teamID: ID!, $name: String!) {\n    createArena(teamID: $teamID, name: $name) {\n      ... on CreateArenaSuccess {\n        arena {\n          id\n          name\n        }\n      }\n      ... on CreateArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.CreateArenaDocument,
    "\n  mutation deleteArena($arenaID: ID!) {\n    deleteArena(arenaID: $arenaID) {\n      ... on DeleteArenaSuccess {\n        arenaID\n      }\n      ... on DeleteArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.DeleteArenaDocument,
    "\n  query getAuthenticatedUser {\n    authenticatedUser { id, username }\n  }\n": types.GetAuthenticatedUserDocument,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on LoginSuccess {\n        user {\n            id, username\n        }\n        token\n      }\n      ... on LoginFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation logout {\n    logout\n}": types.LogoutDocument,
    "\n  query authenticatedUserTournaments {\n    authenticatedUser {\n      id,\n      username,\n      teams {\n        id,\n        name,\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      tournamentInvitations {\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      organizedTournaments {\n        id,\n        name,\n        # lastRoundDate,\n        status,\n      }\n    }\n  }\n": types.AuthenticatedUserTournamentsDocument,
    "\n  query GetTeam($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n": types.GetTeamDocument,
    "\n  mutation createTeam($tournamentID: ID!, $input: TeamInput!) {\n    createTeam(tournamentID: $tournamentID, input: $input) {\n      ... on CreateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on CreateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.CreateTeamDocument,
    "\n  mutation updateTeam($teamID: ID!, $input: TeamInput!) {\n    updateTeam(teamID: $teamID, input: $input) {\n      ... on UpdateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on UpdateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.UpdateTeamDocument,
    "\n  mutation joinTeam($teamID: ID!) {\n      joinTeam(teamID: $teamID) {\n          ... on JoinTeamSuccess {\n            newTeam {\n              id\n            }\n          }\n          ... on JoinTeamFailure {\n            errors {\n              ... on TeamNotFoundError {\n                teamID\n                message\n              }\n              ... on Error {\n                message\n              }\n            }\n          }\n      }\n  }\n": types.JoinTeamDocument,
    "\n  query tournamentTeams($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      teams {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n    }\n  }\n": types.TournamentTeamsDocument,
    "\n  mutation createTournament(\n    $name: String!,\n    $startDate: Date!,\n    $endDate: Date!,\n  ) {\n    createTournament(\n      name: $name\n      startDate: $startDate,\n      endDate: $endDate,\n    ) {\n      id\n      name\n    }\n  }\n": types.CreateTournamentDocument,
    "\n  mutation updateTournamentConfiguration($tournamentID: ID!, $input: TournamentConfigurationInput!) {\n    updateTournamentConfiguration(tournamentID: $tournamentID, input: $input) {\n      ... on UpdateTournamentConfigurationSuccess {\n        tournament {\n          id\n          name\n          startDate\n          endDate\n        }\n      }\n      ... on UpdateTournamentConfigurationFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.UpdateTournamentConfigurationDocument,
    "\n  subscription arenaGames($arenaID: ID!) {\n    arenaGames(arenaID: $arenaID) {\n      ... on GameRef {\n        gameID,\n        graphqlUrl,\n      }\n      ... on ArenaGamesFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.ArenaGamesDocument,
    "\n  mutation createArenaGame($arenaID: ID!) {\n    createArenaGame(arenaID: $arenaID) {\n      ... on CreateArenaGameSuccess {\n        gameID\n      }\n      ... on CreateArenaGameFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n": types.CreateArenaGameDocument,
    "\n  query tournament($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      name\n      status\n      startDate\n      endDate\n      # firstRoundDate\n      # lastRoundDate\n      # roundsNumber\n      # minutesBetweenRounds\n      myRole\n      # invitationLinkID\n    }\n  }\n": types.TournamentDocument,
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
export function graphql(source: "\n  query GetTeamArenas($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        arenas {\n          id\n          name\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTeamArenas($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        arenas {\n          id\n          name\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Arena($arenaID: ID!) {\n    arena(arenaID: $arenaID) {\n      ... on ArenaSuccess {\n        arena {\n          id\n          name\n          players {\n            token\n          }\n        }\n      }\n      ... on ArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Arena($arenaID: ID!) {\n    arena(arenaID: $arenaID) {\n      ... on ArenaSuccess {\n        arena {\n          id\n          name\n          players {\n            token\n          }\n        }\n      }\n      ... on ArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createArena($teamID: ID!, $name: String!) {\n    createArena(teamID: $teamID, name: $name) {\n      ... on CreateArenaSuccess {\n        arena {\n          id\n          name\n        }\n      }\n      ... on CreateArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createArena($teamID: ID!, $name: String!) {\n    createArena(teamID: $teamID, name: $name) {\n      ... on CreateArenaSuccess {\n        arena {\n          id\n          name\n        }\n      }\n      ... on CreateArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteArena($arenaID: ID!) {\n    deleteArena(arenaID: $arenaID) {\n      ... on DeleteArenaSuccess {\n        arenaID\n      }\n      ... on DeleteArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deleteArena($arenaID: ID!) {\n    deleteArena(arenaID: $arenaID) {\n      ... on DeleteArenaSuccess {\n        arenaID\n      }\n      ... on DeleteArenaFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAuthenticatedUser {\n    authenticatedUser { id, username }\n  }\n"): (typeof documents)["\n  query getAuthenticatedUser {\n    authenticatedUser { id, username }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on LoginSuccess {\n        user {\n            id, username\n        }\n        token\n      }\n      ... on LoginFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on LoginSuccess {\n        user {\n            id, username\n        }\n        token\n      }\n      ... on LoginFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout {\n    logout\n}"): (typeof documents)["\n  mutation logout {\n    logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query authenticatedUserTournaments {\n    authenticatedUser {\n      id,\n      username,\n      teams {\n        id,\n        name,\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      tournamentInvitations {\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      organizedTournaments {\n        id,\n        name,\n        # lastRoundDate,\n        status,\n      }\n    }\n  }\n"): (typeof documents)["\n  query authenticatedUserTournaments {\n    authenticatedUser {\n      id,\n      username,\n      teams {\n        id,\n        name,\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      tournamentInvitations {\n        tournament {\n          id,\n          name,\n          # lastRoundDate,\n          status,\n        }\n      }\n      organizedTournaments {\n        id,\n        name,\n        # lastRoundDate,\n        status,\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTeam($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTeam($userID: ID!, $tournamentID: ID!) {\n    team(userID: $userID, tournamentID: $tournamentID) {\n      ... on Team {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n      ... on UserNotPartOfAnyTeam {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTeam($tournamentID: ID!, $input: TeamInput!) {\n    createTeam(tournamentID: $tournamentID, input: $input) {\n      ... on CreateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on CreateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createTeam($tournamentID: ID!, $input: TeamInput!) {\n    createTeam(tournamentID: $tournamentID, input: $input) {\n      ... on CreateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on CreateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTeam($teamID: ID!, $input: TeamInput!) {\n    updateTeam(teamID: $teamID, input: $input) {\n      ... on UpdateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on UpdateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateTeam($teamID: ID!, $input: TeamInput!) {\n    updateTeam(teamID: $teamID, input: $input) {\n      ... on UpdateTeamSuccess {\n        team {\n          id\n          name\n        }\n      }\n      ... on UpdateTeamFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation joinTeam($teamID: ID!) {\n      joinTeam(teamID: $teamID) {\n          ... on JoinTeamSuccess {\n            newTeam {\n              id\n            }\n          }\n          ... on JoinTeamFailure {\n            errors {\n              ... on TeamNotFoundError {\n                teamID\n                message\n              }\n              ... on Error {\n                message\n              }\n            }\n          }\n      }\n  }\n"): (typeof documents)["\n  mutation joinTeam($teamID: ID!) {\n      joinTeam(teamID: $teamID) {\n          ... on JoinTeamSuccess {\n            newTeam {\n              id\n            }\n          }\n          ... on JoinTeamFailure {\n            errors {\n              ... on TeamNotFoundError {\n                teamID\n                message\n              }\n              ... on Error {\n                message\n              }\n            }\n          }\n      }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tournamentTeams($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      teams {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query tournamentTeams($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      teams {\n        id\n        name\n        members {\n          id\n          username\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTournament(\n    $name: String!,\n    $startDate: Date!,\n    $endDate: Date!,\n  ) {\n    createTournament(\n      name: $name\n      startDate: $startDate,\n      endDate: $endDate,\n    ) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createTournament(\n    $name: String!,\n    $startDate: Date!,\n    $endDate: Date!,\n  ) {\n    createTournament(\n      name: $name\n      startDate: $startDate,\n      endDate: $endDate,\n    ) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTournamentConfiguration($tournamentID: ID!, $input: TournamentConfigurationInput!) {\n    updateTournamentConfiguration(tournamentID: $tournamentID, input: $input) {\n      ... on UpdateTournamentConfigurationSuccess {\n        tournament {\n          id\n          name\n          startDate\n          endDate\n        }\n      }\n      ... on UpdateTournamentConfigurationFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateTournamentConfiguration($tournamentID: ID!, $input: TournamentConfigurationInput!) {\n    updateTournamentConfiguration(tournamentID: $tournamentID, input: $input) {\n      ... on UpdateTournamentConfigurationSuccess {\n        tournament {\n          id\n          name\n          startDate\n          endDate\n        }\n      }\n      ... on UpdateTournamentConfigurationFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription arenaGames($arenaID: ID!) {\n    arenaGames(arenaID: $arenaID) {\n      ... on GameRef {\n        gameID,\n        graphqlUrl,\n      }\n      ... on ArenaGamesFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription arenaGames($arenaID: ID!) {\n    arenaGames(arenaID: $arenaID) {\n      ... on GameRef {\n        gameID,\n        graphqlUrl,\n      }\n      ... on ArenaGamesFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createArenaGame($arenaID: ID!) {\n    createArenaGame(arenaID: $arenaID) {\n      ... on CreateArenaGameSuccess {\n        gameID\n      }\n      ... on CreateArenaGameFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createArenaGame($arenaID: ID!) {\n    createArenaGame(arenaID: $arenaID) {\n      ... on CreateArenaGameSuccess {\n        gameID\n      }\n      ... on CreateArenaGameFailure {\n        errors {\n          ... on Error {\n            message\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tournament($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      name\n      status\n      startDate\n      endDate\n      # firstRoundDate\n      # lastRoundDate\n      # roundsNumber\n      # minutesBetweenRounds\n      myRole\n      # invitationLinkID\n    }\n  }\n"): (typeof documents)["\n  query tournament($tournamentID: ID!) {\n    tournament(tournamentID: $tournamentID) {\n      id\n      name\n      status\n      startDate\n      endDate\n      # firstRoundDate\n      # lastRoundDate\n      # roundsNumber\n      # minutesBetweenRounds\n      myRole\n      # invitationLinkID\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;