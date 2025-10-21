'use client';

import { HttpLink, setLogVerbosity } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';

setLogVerbosity('debug');

const makeClient = (): ApolloClient => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
};

export const ApolloWrapper: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};
