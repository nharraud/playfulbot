import type * as ReactTypes from "react";

import { useGraphqlClient } from "./useGraphqlClient";
import { BackendClientContext, RunnerClientContext } from "./GraphqlClientContexts";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient } from "@apollo/client";

interface BackendClientProviderProps {
  children: ReactTypes.ReactNode | ReactTypes.ReactNode[] | null;
}

export function BackendClientProvider({ children } : BackendClientProviderProps) {
  const client = useGraphqlClient({ url: import.meta.env.VITE_API_BACKEND_URL as string });
  if (!client) {
    return (<div/>)
  }
  return (
    <BackendClientContext value={client}>
      <ApolloProvider client={client as ApolloClient}>
        {children}
      </ApolloProvider>
    </BackendClientContext>
  );
}

interface RunnerClientProviderProps {
  children: ReactTypes.ReactNode | ReactTypes.ReactNode[] | null;
  runnerUrl: string | undefined;
}

export function RunnerClientProvider({ children, runnerUrl } : RunnerClientProviderProps) {
  const client = useGraphqlClient({ url: runnerUrl, withHttp: false });
  if (!client) {
    return (<div/>)
  }
  return (
    <RunnerClientContext value={client}>
      {children}
    </RunnerClientContext>
  );
}