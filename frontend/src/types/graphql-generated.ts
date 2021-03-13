import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type Tournament = {
  __typename?: 'Tournament';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  name: Scalars['String'];
  members?: Maybe<Array<Maybe<User>>>;
};

export type UserNotPartOfAnyTeam = {
  __typename?: 'UserNotPartOfAnyTeam';
  message: Scalars['String'];
};

export type UserTeamResult = Team | UserNotPartOfAnyTeam;

export type LoginResult = {
  __typename?: 'LoginResult';
  user: User;
  token: Scalars['String'];
};

export type PlayerAssignment = {
  __typename?: 'PlayerAssignment';
  playerID: Scalars['String'];
  playerNumber: Scalars['Int'];
};

export type Game = {
  __typename?: 'Game';
  id?: Maybe<Scalars['ID']>;
  version: Scalars['Int'];
  assignments: Array<PlayerAssignment>;
  gameState: Scalars['JSON'];
};

export type GamePatch = {
  __typename?: 'GamePatch';
  patch: Scalars['JSON'];
  gameID: Scalars['ID'];
  version: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  play?: Maybe<Scalars['Boolean']>;
  createNewDebugGame?: Maybe<GameSchedule>;
  createNewDebugGameForUser?: Maybe<GameSchedule>;
  registerUser?: Maybe<LoginResult>;
  login?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']>;
  createTournament?: Maybe<Tournament>;
};


export type MutationPlayArgs = {
  gameID: Scalars['ID'];
  playerID: Scalars['ID'];
  action: Scalars['String'];
  data: Scalars['JSON'];
};


export type MutationCreateNewDebugGameForUserArgs = {
  userID: Scalars['ID'];
};


export type MutationRegisterUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateTournamentArgs = {
  name: Scalars['String'];
};

export type Player = {
  __typename?: 'Player';
  id?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['String']>;
};

export type GameSchedule = {
  __typename?: 'GameSchedule';
  id: Scalars['ID'];
  players?: Maybe<Array<Maybe<Player>>>;
  game?: Maybe<Game>;
};

export type LiveGame = Game | GamePatch;

export type Subscription = {
  __typename?: 'Subscription';
  gamePatch?: Maybe<LiveGame>;
  gameScheduleChanges?: Maybe<GameSchedule>;
};


export type SubscriptionGamePatchArgs = {
  gameID: Scalars['ID'];
};


export type SubscriptionGameScheduleChangesArgs = {
  scheduleID: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  tournament?: Maybe<Tournament>;
  game?: Maybe<Game>;
  debugGame?: Maybe<GameSchedule>;
  gameSchedule?: Maybe<GameSchedule>;
  team?: Maybe<UserTeamResult>;
  authenticatedUser?: Maybe<User>;
};


export type QueryTournamentArgs = {
  tournamentID?: Maybe<Scalars['ID']>;
};


export type QueryGameArgs = {
  gameID?: Maybe<Scalars['ID']>;
};


export type QueryDebugGameArgs = {
  userID: Scalars['ID'];
};


export type QueryGameScheduleArgs = {
  scheduleID: Scalars['ID'];
};


export type QueryTeamArgs = {
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
};

export type GetTeamQueryVariables = Exact<{
  userID: Scalars['ID'];
  tournamentID: Scalars['ID'];
}>;


export type GetTeamQuery = (
  { __typename?: 'Query' }
  & { team?: Maybe<(
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
    & { members?: Maybe<Array<Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>>> }
  ) | (
    { __typename?: 'UserNotPartOfAnyTeam' }
    & Pick<UserNotPartOfAnyTeam, 'message'>
  )> }
);


export const GetTeamDocument = gql`
    query GetTeam($userID: ID!, $tournamentID: ID!) {
  team(userID: $userID, tournamentID: $tournamentID) {
    ... on Team {
      id
      name
      members {
        id
        username
      }
    }
    ... on UserNotPartOfAnyTeam {
      message
    }
  }
}
    `;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      userID: // value for 'userID'
 *      tournamentID: // value for 'tournamentID'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;