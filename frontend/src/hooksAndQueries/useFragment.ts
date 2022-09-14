import { DataProxy, OperationVariables } from '@apollo/client';
import { client } from '../apolloConfig';
import { useGraphqlCacheLock } from './useGraphqlCacheLock';

type readFragmentOptions<T = any, TVariables = OperationVariables> = DataProxy.Fragment<
  TVariables,
  T
>;

/**
 * Read a fragment from apollo cache and force cache to retain it as long as it is used.
 * @param options options provided to ApolloClient.readFragment
 * @param optimistic optimistic parameter provided to ApolloClient.readFragment
 * @returns result from calling ApolloClient.readFragment.
 */
export function useFragment<T>(options: readFragmentOptions<T>, optimistic?: boolean) {
  useGraphqlCacheLock(options.id);
  const result = client.readFragment<T>(options, optimistic);
  return result;
}
