# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Read First

**Before making ANY code changes:**

### � Required Reading (IN ORDER)

1. �🚨 **[CODE_MODIFICATION_RULES.md](docs/CODE_MODIFICATION_RULES.md)** - Core rules
2. ⭐ **[Layout & Mobile Optimization Guide](docs/guides/layout-mobile-optimization-guide.md)** - PRIMARY REFERENCE
3. 📦 **[Reusable Components Reference](docs/guides/reusable-components-reference.md)** - Before creating components
4. 📚 **[Documentation Index](docs/README.md)** - All available guides

### 🎯 Golden Rules

1. **If code works without errors, DON'T CHANGE IT**
2. **Make MINIMAL changes only** - don't refactor or "improve" working code
3. **Only refactor when explicitly requested** in the prompt
4. **Always check guides first** before implementing anything
5. **Test incrementally** - verify each small change before proceeding

### ✅ Before Any Change

- [ ] Read the relevant guide (layout, components, patterns)
- [ ] Check if reusable component exists before creating new one
- [ ] Verify naming conventions (descriptive, not generic)
- [ ] Ensure mobile-first approach (touch targets, text sizing)
- [ ] Preserve existing UI/UX unless explicitly requested to change

### 🏗️ Best Practices

#### Naming Conventions

**✅ DO:**

```tsx
// Descriptive component names
(DiaryStats.tsx, DiaryForm.tsx, DiaryList.tsx);

// Descriptive function names
function formatDiaryDate() {}
function validateDiaryEntry() {}

// Descriptive variable names
const isFormValid = true;
const diaryEntryCount = 5;
```

**❌ DON'T:**

```tsx
// Generic, meaningless names
(ClientChild.tsx, Helper.tsx, Utils.tsx);

// Generic function names
function doStuff() {}
function handler() {}

// Single letter or unclear names
const x = true;
const data = 5;
```

#### File Organization

- Component files match their export: `DiaryStats.tsx` exports `DiaryStats`
- Use kebab-case for file names: `diary-stats.tsx`
- Group related files: `site-diary/diary-form.tsx`, `site-diary/diary-list.tsx`

#### Mobile-First

- **ALWAYS use reusable layout components**: `PageContainer`, `PageHeader`
- **Default button/input sizes are mobile-optimized** (h-11, 44px)
- **Keep text-base (16px) on inputs** to prevent iOS zoom
- **Touch targets minimum 44px** (already default in components)

#### Code Quality

- Remove unused imports, files, and code
- Use TypeScript types, avoid `any`
- Follow existing patterns in the codebase
- Keep functions small and focused
- Write self-documenting code (good names > comments)

---

## Project Overview

This is a Yarn v1 monorepo containing a mobile app (React Native/Expo) and a web app (Next.js) that share a GraphQL API for site diary management. The web app serves as the GraphQL backend using Grats for schema generation, while the mobile app consumes the API.

## Prerequisites

- Node.js 22
- Yarn v1 (v1.22.22)
- Cocoapods (for iOS development)

## Monorepo Structure

```
apps/
  mobile/       # React Native/Expo mobile app with GraphQL client
  web/          # Next.js app with GraphQL API server (Grats-based)
packages/
  eslint-config/ # Shared ESLint configuration
```

## Development Commands

### Initial Setup

```bash
yarn install
```

### Mobile App (@untitled/mobile)

```bash
# First-time setup (iOS/Android native builds)
yarn workspace @untitled/mobile prebuild
yarn workspace @untitled/mobile ios
yarn workspace @untitled/mobile android

# Start dev server (if app already installed on simulator)
yarn dev:mobile
# Or: yarn workspace @untitled/mobile dev

# Generate GraphQL types from web API
yarn workspace @untitled/mobile codegen

# Type checking
yarn workspace @untitled/mobile typecheck

# Linting
yarn workspace @untitled/mobile lint
```

### Web App (@untitled/web)

```bash
# Start GraphQL API server (default: http://localhost:3000)
yarn dev:web
# Or: yarn workspace @untitled/web dev

# GraphQL endpoint: http://localhost:3000/api/graphql

# Build for production
yarn workspace @untitled/web build

# Start production server
yarn workspace @untitled/web start

# Regenerate GraphQL schema (from Grats decorators)
yarn workspace @untitled/web grats

# Generate GraphQL types from schema
yarn workspace @untitled/web codegen

# Type checking
yarn workspace @untitled/web typecheck

# Linting
yarn workspace @untitled/web lint
```

### Monorepo-wide Commands

```bash
# Run all CI checks (format, lint, typecheck)
yarn ci

# Format all code
yarn format

# Check formatting
yarn format-check

# Run linting across all workspaces
yarn lint

# Run type checking across all workspaces
yarn typecheck

# Run codegen across all workspaces (mobile + web)
yarn codegen

# Check dependency consistency
yarn sherif-check

# Fix dependency inconsistencies
yarn sherif
```

## Architecture

### Web App (GraphQL API Backend & Frontend)

- **Framework**: Next.js 15 with App Router and Turbopack
- **GraphQL Server**: Uses [Grats](https://grats.capt.dev) for code-first GraphQL schema generation
  - Schema is auto-generated in `schema.ts` and `schema.graphql` by Grats CLI
  - Resolvers are defined in `src/app/api/graphql/query.ts` and `mutation.ts` using `@gql*` JSDoc decorators
  - GraphQL endpoint served via GraphQL Yoga at `/api/graphql`
- **GraphQL Client**: Apollo Client v4 for frontend data fetching
  - Client configuration in `src/lib/apollo-client.ts`
  - Apollo provider wrapper in `src/components/apollo-wrapper.tsx`
  - Queries defined in `src/graphql/queries.ts`
  - TypeScript types auto-generated via GraphQL Codegen in `src/types/__generated__/graphql.ts`
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) for React components
  - Components in `src/components/ui/`
  - Configuration in `components.json`
- **Data Layer**: In-memory data in `src/data/site-diary.ts`
- **API Structure**:
  - GraphQL API: `/api/graphql` (query and mutation operations)
  - REST endpoints: `/api/site-diary` for site diary CRUD operations
- **Key Types**: Defined in `src/data/site-diary.ts` with Grats decorators (SiteDiary, Weather)

### Mobile App (GraphQL Client)

- **Framework**: Expo 54 with Expo Router (file-based routing)
- **GraphQL Client**: Apollo Client v4
- **Navigation**: Expo Router with tab-based navigation in `src/app/(tabs)`
- **Styling**: NativeWind (Tailwind CSS for React Native) with class-variance-authority
- **Code Generation**: GraphQL Codegen generates TypeScript types from web API schema
  - Config: `codegen.ts`
  - Generated types: `src/types/__generated__/graphql.ts`
  - Run codegen when GraphQL schema changes
- **Compiler**: React Compiler enabled for automatic optimization
- **Animation**: Reanimated with worklets support

### GraphQL Schema Workflow

1. Web app: Define/modify GraphQL types and resolvers in `src/app/api/graphql/` using Grats JSDoc decorators
2. Web app: Run `yarn workspace @untitled/web grats` to regenerate `schema.ts` and `schema.graphql`
3. Ensure web dev server is running (`yarn dev:web`)
4. Run `yarn codegen` to generate TypeScript types for both web and mobile apps
   - Or run individually: `yarn workspace @untitled/web codegen` and `yarn workspace @untitled/mobile codegen`

### Development Workflow

1. Start web server first (codegen depends on it): `yarn dev:web`
2. For mobile development after first prebuild: `yarn dev:mobile`
3. When making GraphQL schema changes:
   - Update query/mutation files in web app with Grats decorators
   - Run `yarn workspace @untitled/web grats` to regenerate schema
   - Run `yarn codegen` to update TypeScript types in both web and mobile apps

## Technology Stack

### Shared

- TypeScript 5.9
- GraphQL 16.11
- React 19.1 (resolution override)
- Turbo for monorepo task orchestration
- Prettier with multiple plugins for code formatting

### Mobile-Specific

- Expo SDK 54
- Expo Router 6 (file-based routing)
- Apollo Client 4
- NativeWind (Tailwind for React Native)
- React Native Reanimated
- React Compiler (babel-plugin-react-compiler)

### Web-Specific

- Next.js 15 with App Router and Turbopack
- GraphQL Yoga for GraphQL server
- Grats for schema generation
- Apollo Client 4 for GraphQL client
- shadcn/ui for UI components
- Tailwind CSS for styling

## Important Notes

- Both GraphQL codegen commands (web and mobile) expect the web server to be running at `http://localhost:3000/api/graphql`
- Both apps use React 19.1 via yarn resolutions
- Mobile app uses Expo Router with tabs layout - routes are in `src/app/(tabs)`
- Web app uses both server-side (Grats/GraphQL Yoga) and client-side (Apollo Client) GraphQL
- Schema changes must be made through Grats decorators in the web app, not by manually editing `schema.ts` or `schema.graphql`
- Run `yarn codegen` (or use Turbo) to update generated types in both apps after schema changes
- The web app also has REST API endpoints at `/api/site-diary` for traditional HTTP operations

### Next.js Image Configuration

**⚠️ When using external images (Unsplash, CDN, etc.):**

The Next.js Image component requires explicit configuration for external hostnames. If you encounter an error like:

```
Invalid src prop on next/image, hostname 'example.com' is not configured
```

**Solution:** Update `apps/web/next.config.ts` to whitelist the hostname using `remotePatterns`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
```

**✅ This is the recommended best practice** as documented in the [official Next.js Image Optimization documentation](https://nextjs.org/docs/app/building-your-application/optimizing/images#remotepatterns). The `remotePatterns` configuration:

- Is the modern, actively maintained API (supersedes the deprecated `domains` config)
- Provides fine-grained security control (protocol, hostname, port, pathname)
- Enables automatic image optimization (WebP/AVIF, responsive sizing, lazy loading)
- Follows a secure whitelist approach

**Before adding new image features:**

1. Check if external images will be used (Unsplash, S3, CDN, etc.)
2. Proactively configure `remotePatterns` in `next.config.ts`
3. Test with actual image URLs to verify configuration
4. Document any new image sources in this file

This prevents runtime errors when users view pages with external images.
