# Expo App

## Technologies

- Expo 54 & React Native 0.81 with the New Architecture
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing
- [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL data fetching
- [NativeWind 5](https://www.nativewind.dev/) & [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org)
- [React Compiler](https://react.dev/learn/react-compiler) for automatic optimization

## Environment Variables

Create a `.env` file in this directory:

```sh
EXPO_PUBLIC_API_GRAPHQL_URL=https://buildpass-mock-api.preview.buildpass.com.au/api/graphql
```

or

```sh
EXPO_PUBLIC_API_GRAPHQL_URL=http://localhost:3000/api/graphql
```

For building and running apps locally, follow the [Expo setup guides](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated).

## Getting Started

**First time setup** (iOS/Android) from the monorepo root:

```bash
yarn workspace @untitled/mobile prebuild
yarn workspace @untitled/mobile ios
# or
yarn workspace @untitled/mobile android
```

**After initial setup**, start the dev server from the monorepo root:

```bash
yarn dev:mobile
```

Or from this directory:

```bash
yarn dev
```

If using the local API, you'll also need to start the GraphQL development server:

```bash
yarn dev:web
```

## Generating GraphQL Types

After making changes to the GraphQL schema in the web app, regenerate TypeScript types from the monorepo root:

```bash
yarn codegen
```

Or from this directory:

```bash
yarn codegen
```

**Note**: The web dev server must be running at `http://localhost:3000` for codegen to work when using the local API setup.
