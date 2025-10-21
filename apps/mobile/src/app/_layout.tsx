import '../../global.css';
import { AppleStackPreset } from '@/lib/theme';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react/compiled';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_API_GRAPHQL_URL,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export { ErrorBoundary } from 'expo-router';

const RootLayout: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView>
        <RootNavigator />
        <PortalHost />
      </GestureHandlerRootView>
    </ApolloProvider>
  );
};

RootLayout.displayName = 'RootLayout';

const RootNavigator: React.FC = () => {
  return (
    <Stack screenOptions={{ ...AppleStackPreset, navigationBarHidden: true }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          contentStyle: {
            backgroundColor: 'transparent',
          },
          headerShown: false,
        }}
      />
    </Stack>
  );
};

RootNavigator.displayName = 'RootNavigator';

export default RootLayout;
