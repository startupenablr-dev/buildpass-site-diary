# Monorepo

This is a Yarn v1 monorepo containing a mobile app (React Native/Expo) and a web app (Next.js) that share a GraphQL API for site diary management.

## Getting Started

### Prerequisites

- Node.js 22
- Yarn v1 (v1.22.22)
- Cocoapods (for iOS development)

```bash
brew install node yarn cocoapods
```

### Installing Dependencies

Run:

```bash
yarn install
```

### Running the Web App (GraphQL API and Next.js Frontend)

```bash
yarn dev:web
```

The GraphQL API will be available at `http://localhost:3000/api/graphql`.

For app-specific documentation and how to setup your `.env.local` file, see the [Web App README](./apps/web/README.md).

### Running the iOS/Android App in a simulator

For building and running apps locally, follow the [Expo setup guides](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated).

```bash
yarn workspace @untitled/mobile prebuild
yarn workspace @untitled/mobile ios
yarn workspace @untitled/mobile android
```

If you already have the app installed on your simulator, you can skip the above steps and simply run `yarn dev:mobile` to start the development server.

For app-specific documentation and how to setup your `.env` file, see the [Mobile App README](./apps/mobile/README.md).

## Common Commands

```bash
# Run all CI checks (format, lint, typecheck)
yarn ci

# Format all code
yarn format

# Run linting across all workspaces
yarn lint

# Run type checking across all workspaces
yarn typecheck

# Generate GraphQL types for both web and mobile apps
yarn codegen
```

## More Info

For a comprehensive reference including architecture details, development workflows, and all available commands, see [CLAUDE.md](./CLAUDE.md).
