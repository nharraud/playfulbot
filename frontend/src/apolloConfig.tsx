import { ApolloClient, split, from, HttpLink, ServerError } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { apolloCache } from './apolloCache';
import { triggerUserContextUpdate } from './UserContext';
import { subscriptionReconnectListeners } from './hooksAndQueries/useRestartingSubscription';

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_HTTP_URL}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

function isServerError(error): error is ServerError {
  return (error as ServerError).statusCode !== undefined;
}

function resetAuthentication() {
  localStorage.removeItem('token');
  triggerUserContextUpdate();
  client.resetStore();
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError && isServerError(networkError)) {
    for (const error of networkError.result.errors) {
      if (error.extensions.code === 'UNAUTHENTICATED') {
        resetAuthentication();
      }
    }
  }

  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      if (error?.extensions.code === 'UNAUTHENTICATED') {
        resetAuthentication();
      }
    }
  }
});

// const wsLink = new GraphQLWsLink(
const subscriptionClient = createClient({
  url: `${import.meta.env.VITE_API_WEBSOCKET_URL}/graphql`,
  lazy: true,
  connectionParams: () => {
    const token = localStorage.getItem('token');
    return {
      authToken: token,
    };
  },
  on: {
    connected: (socket) => {
      client.resetStore();
      for (const listener of subscriptionReconnectListeners) {
        listener();
      }
    },
    error: (error) => {
      console.error('Graphql Websocket client onError', { error });
    },
  },
});

const wsLink = new GraphQLWsLink(subscriptionClient);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: apolloCache,
});
