import { ApolloClient } from '@apollo/client';
import { createContext } from 'react';

export const BackendClientContext = createContext<ApolloClient | undefined>(undefined);
export const RunnerClientContext = createContext<ApolloClient | undefined>(undefined);