import { useState, useRef, useEffect, useCallback } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult as ApolloSubscriptionResult,
  useApolloClient,
} from '@apollo/client';
import { usePrevious } from './usePrevious';

export const subscriptionReconnectListeners = new Array<() => void>();

export function useRestartingSubscription<TData = any, TVariables = OperationVariables>(
  subscriptionDocument: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: SubscriptionHookOptions<TData, TVariables>
): ApolloSubscriptionResult<TData> {
  const [result, setResult] = useState<ApolloSubscriptionResult<TData>>({ loading: false });
  const client = useApolloClient();
  const subscriptionRef = useRef<ZenObservable.Subscription>();
  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = undefined;
    }
  }, []);

  const subscribe = useCallback(() => {
    setResult({ loading: !options.skip });
    if (!options.skip) {
      if (subscriptionRef.current) {
        throw new Error('Subscription is already running. It should be unsubscribed first.');
      }

      const observer = client.subscribe<TData, TVariables>({
        query: subscriptionDocument,
        ...options,
      });

      subscriptionRef.current = observer.subscribe(
        ({ data }) => {
          setResult({ loading: false, data });
        },
        (error) => {
          setResult({ loading: false, data: undefined, error });
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, subscriptionDocument, options.skip, ...Object.values(options.variables)]);

  const resubscribe = useCallback(() => {
    unsubscribe();
    subscribe();
  }, [unsubscribe, subscribe]);

  const previousResubscribe = usePrevious(resubscribe);

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, [unsubscribe, subscribe]);

  useEffect(() => {
    if (previousResubscribe) {
      const listenerIndex = subscriptionReconnectListeners.findIndex(
        (value) => value === previousResubscribe
      );
      if (listenerIndex !== -1) {
        subscriptionReconnectListeners.splice(listenerIndex, 1);
      }
    }
    subscriptionReconnectListeners.push(resubscribe);
    return () => {
      const listenerIndex = subscriptionReconnectListeners.findIndex(
        (value) => value === resubscribe
      );
      if (listenerIndex !== -1) {
        subscriptionReconnectListeners.splice(listenerIndex, 1);
      }
    };
  }, [previousResubscribe, resubscribe]);

  return result;
}
