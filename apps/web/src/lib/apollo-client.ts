import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            siteDiaries: {
              merge(existing, incoming) {
                // Replace the existing list with the incoming list
                return incoming;
              },
            },
          },
        },
      },
    }),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
    }),
  });
});
