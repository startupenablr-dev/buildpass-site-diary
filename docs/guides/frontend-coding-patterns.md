# Frontend Coding Patterns & Architecture Guide

**Project:** Site Diary Management System  
**Last Updated:** October 22, 2025  
**Target Audience:** New developers joining the project  
**Purpose:** Complete reference for frontend patterns, architecture, and backend integration

---

## Table of Contents

1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [GraphQL Integration Pattern](#3-graphql-integration-pattern)
4. [Component Architecture Patterns](#4-component-architecture-patterns)
5. [Styling Patterns & Conventions](#5-styling-patterns--conventions)
6. [State Management Patterns](#6-state-management-patterns)
7. [Type Safety & Code Generation](#7-type-safety--code-generation)
8. [Routing Patterns](#8-routing-patterns)
9. [Error Handling Patterns](#9-error-handling-patterns)
10. [File Organization & Naming Conventions](#10-file-organization--naming-conventions)
11. [Backend Integration Workflow](#11-backend-integration-workflow)
12. [Best Practices & Common Patterns](#12-best-practices--common-patterns)
13. [Mobile-Specific Patterns](#13-mobile-specific-patterns)
14. [Development Workflow](#14-development-workflow)
15. [Quick Reference Cheat Sheet](#15-quick-reference-cheat-sheet)

---

## 1. Project Architecture Overview

### 1.1 Monorepo Structure

This project uses a **Yarn Workspaces monorepo** with shared dependencies and tooling:

```
coding-test/
├── apps/
│   ├── web/          # Next.js 15 (App Router)
│   └── mobile/       # React Native + Expo
├── packages/
│   └── eslint-config/  # Shared linting rules
└── docs/
    └── guides/       # Documentation (you are here)
```

**Key Principle:** Code sharing through monorepo structure, but apps remain independent.

### 1.2 Web Application Architecture (Next.js)

**Pattern:** Full-stack Next.js with co-located API and frontend

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── (routes)/          # Frontend pages
│   │   └── api/               # Backend API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities & clients
│   ├── graphql/               # GraphQL queries/mutations
│   ├── data/                  # Data layer
│   └── types/__generated__/   # Auto-generated types
```

**Why This Matters:**

- Frontend and backend live in the same codebase
- API routes are just files in the `app/api/` folder
- Type safety from backend to frontend through code generation

### 1.3 Mobile Application Architecture (React Native + Expo)

**Pattern:** File-based routing with Expo Router

```
apps/mobile/
├── src/
│   ├── app/                   # Expo Router (file-based)
│   │   ├── (tabs)/           # Tab navigation
│   │   └── _layout.tsx       # Root layout
│   ├── components/           # React Native components
│   ├── lib/                  # Utilities
│   └── types/__generated__/  # Auto-generated types
```

**Key Difference from Web:**

- Uses React Native components instead of HTML
- Navigation through Expo Router (file-based)
- Shares GraphQL schema and types with web app

---

## 2. Technology Stack & Dependencies

### 2.1 Core Frontend Technologies

#### Web Application

```json
{
  "framework": "Next.js 15.5.6",
  "react": "19.1.0",
  "rendering": "App Router with RSC (React Server Components)",
  "bundler": "Turbopack",
  "language": "TypeScript 5.9.3"
}
```

#### Mobile Application

```json
{
  "framework": "Expo 54.0.13",
  "react-native": "0.81.4",
  "routing": "Expo Router 6.0.12",
  "language": "TypeScript 5.9.3"
}
```

### 2.2 Data Fetching Stack

Both apps use **Apollo Client** for GraphQL:

| Package                             | Version | Purpose                           |
| ----------------------------------- | ------- | --------------------------------- |
| `@apollo/client`                    | 4.0.7   | GraphQL client library            |
| `@apollo/client-integration-nextjs` | 0.14.0  | Next.js 15 integration (web only) |
| `graphql`                           | 16.11.0 | GraphQL query language            |

**Pattern Used:** Apollo Client with type-safe queries

### 2.3 Backend Stack

| Package                | Version | Purpose                           |
| ---------------------- | ------- | --------------------------------- |
| `graphql-yoga`         | 5.16.0  | GraphQL server                    |
| `grats`                | 0.0.34  | Schema generation from TypeScript |
| `@graphql-codegen/cli` | 6.0.0   | Type generation                   |

**Key Pattern:** Schema-first GraphQL with TypeScript annotations

### 2.4 Styling Stack

#### Web

```json
{
  "framework": "Tailwind CSS 4.1.15",
  "components": "shadcn/ui (Radix UI + Tailwind)",
  "utilities": ["clsx", "tailwind-merge", "class-variance-authority"]
}
```

#### Mobile

```json
{
  "framework": "NativeWind 5.0.0 (Tailwind for React Native)",
  "components": "rn-primitives (Radix-like for React Native)",
  "utilities": ["clsx", "tailwind-merge", "class-variance-authority"]
}
```

**Shared Pattern:** Same styling API across web and mobile

---

## 3. GraphQL Integration Pattern

### 3.1 Backend Schema Generation with Grats

**Pattern:** TypeScript-first schema generation using JSDoc annotations

#### Step 1: Define Types with Grats Annotations

**File:** `apps/web/src/data/site-diary.ts`

```typescript
import type { Int } from 'grats';

/** @gqlType */
export type Weather = {
  /** @gqlField */
  temperature: Int;
  /** @gqlField */
  description: string;
};

/** @gqlType */
export type SiteDiary = {
  /** @gqlField */
  id: string;
  /** @gqlField */
  date: string;
  /** @gqlField */
  weather?: Weather;
  /** @gqlField */
  createdBy: string;
  /** @gqlField */
  title: string;
  /** @gqlField */
  content?: string;
  /** @gqlField */
  attendees?: string[];
  /** @gqlField */
  attachments?: string[];
};
```

**Key Pattern:**

- `/** @gqlType */` → Generates GraphQL type
- `/** @gqlField */` → Generates GraphQL field
- TypeScript types become GraphQL schema

#### Step 2: Define Resolvers with Annotations

**File:** `apps/web/src/app/api/graphql/query.ts`

```typescript
import { siteDiaries as rawSiteDiaries, SiteDiary } from '@/data/site-diary';

/** @gqlQueryField */
export function siteDiaries(): Array<SiteDiary> {
  return rawSiteDiaries;
}

/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary | undefined {
  return rawSiteDiaries.find((entry) => entry.id === id);
}
```

**Key Pattern:**

- `/** @gqlQueryField */` → Creates root Query field
- Function name becomes field name
- Function parameters become arguments
- Return type becomes field type

#### Step 3: Define Mutations

**File:** `apps/web/src/app/api/graphql/mutation.ts`

```typescript
/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  // Implementation here
  return input;
}
```

**Key Pattern:**

- `/** @gqlInput */` → Creates GraphQL input type
- `/** @gqlMutationField */` → Creates root Mutation field

#### Step 4: Generate Schema

```bash
cd apps/web
yarn grats
```

**Output:** `apps/web/src/app/api/graphql/schema.ts` (auto-generated)

**Resulting GraphQL Schema:**

```graphql
type Query {
  siteDiaries: [SiteDiary!]!
  siteDiary(id: String!): SiteDiary
}

type Mutation {
  createSiteDiary(input: SiteDiaryInput!): SiteDiary!
}

type SiteDiary {
  id: String!
  date: String!
  title: String!
  createdBy: String!
  content: String
  weather: Weather
  attendees: [String!]
  attendees: [String!]
}

type Weather {
  temperature: Int!
  description: String!
}

input SiteDiaryInput {
  id: String!
  date: String!
  title: String!
  createdBy: String!
}
```

### 3.2 GraphQL Server Setup

**File:** `apps/web/src/app/api/graphql/route.ts`

```typescript
import { createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { getSchema } from './schema';

const { handleRequest } = createYoga({
  schema: getSchema(),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export async function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {});
}
```

**Pattern Breakdown:**

- **GraphQL Yoga** handles GraphQL requests
- **Next.js Route Handler** pattern (GET, POST, OPTIONS)
- Schema is imported from auto-generated file
- Endpoint is `/api/graphql`

**Key Insight:** This is a standard Next.js API route that handles GraphQL!

### 3.3 Client-Side GraphQL Setup (Web)

#### Pattern 1: Server-Side Apollo Client (RSC)

**File:** `apps/web/src/lib/apollo-client.ts`

```typescript
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
    }),
  });
});
```

**Pattern:**

- `registerApolloClient()` → Creates server-side client for RSC
- Returns `getClient`, `query`, `PreloadQuery` utilities
- Used in **Server Components**

**Usage in Server Component:**

```typescript
import { PreloadQuery } from '@/lib/apollo-client';
import { SITE_DIARIES } from '@/graphql/queries';

const Home: React.FC = () => {
  return (
    <PreloadQuery query={SITE_DIARIES}>
      <Suspense fallback={<>Loading...</>}>
        <ClientChild />
      </Suspense>
    </PreloadQuery>
  );
};
```

**Pattern:**

- `PreloadQuery` fetches data on server
- Data is streamed to client
- Client components access data via hooks

#### Pattern 2: Client-Side Apollo Provider (Client Components)

**File:** `apps/web/src/components/apollo-wrapper.tsx`

```typescript
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
```

**Pattern:**

- Mark as `'use client'` → Client Component
- `makeClient` function creates fresh client instances
- Wrapped around app in root layout

**Usage in Root Layout:**

**File:** `apps/web/src/app/layout.tsx`

```typescript
import { ApolloWrapper } from '@/components/apollo-wrapper';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
};
```

**Pattern:** Provider wraps entire app for client-side queries

### 3.4 Client-Side GraphQL Setup (Mobile)

**File:** `apps/mobile/src/app/_layout.tsx`

```typescript
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react/compiled';

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_API_GRAPHQL_URL,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

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
```

**Pattern:**

- Standard Apollo Client setup (no Next.js integration)
- Wraps app with `ApolloProvider`
- Uses `@apollo/client/react/compiled` for React Native

### 3.5 Defining GraphQL Queries

**File:** `apps/web/src/graphql/queries.ts` (shared pattern for mobile too)

```typescript
import { gql } from '@apollo/client';

export const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
    }
  }
`;
```

**Pattern:**

- Use `gql` template tag
- Name queries explicitly (`query SiteDiaries`)
- Export as constants

**Naming Convention:**

- Constant name: `SITE_DIARIES` (SCREAMING_SNAKE_CASE)
- Query name: `SiteDiaries` (PascalCase)

### 3.6 Using Queries in Components

#### Web (Client Component with Suspense)

**File:** `apps/web/src/components/client-child.tsx`

```typescript
'use client';

import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { SITE_DIARIES } from '../graphql/queries';

export const ClientChild: React.FC = () => {
  const { data } = useSuspenseQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  return <div>{data.siteDiaries?.length}</div>;
};
```

**Pattern:**

- `'use client'` directive
- `useSuspenseQuery` hook for React Suspense
- Typed with generated types
- Used inside `<Suspense>` boundary

#### Mobile (Standard Hook)

**File:** `apps/mobile/src/app/(tabs)/(home)/index.tsx`

```typescript
import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/compiled';

const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
    }
  }
`;

const IndexScreen: React.FC = () => {
  const { data, loading } = useQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  return (
    <View>
      <Text>{loading ? 'Loading...' : data?.siteDiaries?.length}</Text>
    </View>
  );
};
```

**Pattern:**

- `useQuery` hook (not Suspense-based)
- Handle `loading` state manually
- Same type generation pattern

### 3.7 Type Generation from GraphQL

**File:** `apps/web/codegen.ts` (similar for mobile)

```typescript
import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/__generated__/graphql.ts': {
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: 'unknown',
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
```

**Pattern:**

1. Points to GraphQL endpoint (`schema`)
2. Scans all TypeScript files for queries (`documents`)
3. Generates types in `src/types/__generated__/graphql.ts`

**Generated Types Example:**

```typescript
export type SiteDiariesQuery = {
  siteDiaries: Array<{
    __typename: 'SiteDiary';
    id: string;
    title: string;
  }>;
};

export type SiteDiariesQueryVariables = Exact<{ [key: string]: never }>;
```

**Workflow:**

```bash
# 1. Update backend schema
cd apps/web
yarn grats

# 2. Generate frontend types
yarn codegen
```

**Key Principle:** Single source of truth (TypeScript types) → GraphQL schema → Frontend types

---

## 4. Component Architecture Patterns

### 4.1 Server Components vs Client Components (Web)

#### Server Component Pattern

**Default in Next.js 15 App Router**

```typescript
// No 'use client' directive = Server Component
import { PreloadQuery } from '@/lib/apollo-client';
import { SITE_DIARIES } from '@/graphql/queries';

const HomePage: React.FC = () => {
  // Runs on server, can fetch data, access DB, etc.
  return (
    <div>
      <PreloadQuery query={SITE_DIARIES}>
        <ClientChild />
      </PreloadQuery>
    </div>
  );
};

export default HomePage;
```

**When to Use:**

- Default choice for pages
- Data fetching
- SEO-critical content
- No interactivity needed

#### Client Component Pattern

```typescript
'use client'; // ← Required directive

import { useState } from 'react';

const InteractiveComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
};
```

**When to Use:**

- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Apollo Client hooks (useQuery, useMutation, etc.)

### 4.2 Component File Structure

#### Pattern: One component per file

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const MyComponent: React.FC = () => {
  return (
    <div>
      <Text>Hello</Text>
      <Button>Click me</Button>
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

**Key Patterns:**

1. Component name matches file name
2. Use `React.FC` type
3. Add `displayName` for dev tools
4. Default export for pages/screens
5. Named export for reusable components

### 4.3 UI Component Pattern (shadcn/ui)

**File:** `apps/web/src/components/ui/button.tsx`

```typescript
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border bg-background shadow-xs hover:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

**Pattern Breakdown:**

1. **CVA (Class Variance Authority):** Define variants
2. **Radix UI Slot:** Polymorphic component (`asChild` prop)
3. **cn() utility:** Merge Tailwind classes
4. **TypeScript:** Full type safety with `VariantProps`

**Usage:**

```typescript
import { Button } from '@/components/ui/button';

<Button variant="outline" size="lg">Click me</Button>
<Button asChild>
  <a href="/about">Link as button</a>
</Button>
```

### 4.4 Mobile UI Component Pattern

**File:** `apps/mobile/src/components/ui/text.tsx`

```typescript
import { cn } from '@/lib/cn.ts';
import { Text as Slot_Text } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Platform, Text as RNText } from 'react-native';

const textVariants = cva(
  cn('text-foreground text-base', Platform.select({ web: 'select-text' })),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: '',
        h1: cn('text-center text-4xl font-extrabold tracking-tight'),
        h2: cn('border-border border-b pb-2 text-3xl font-semibold'),
        p: 'mt-3 leading-7 sm:mt-6',
        muted: 'text-muted-foreground text-sm',
      },
    },
  },
);

export const Text: React.FC<
  React.ComponentProps<typeof RNText> &
    VariantProps<typeof textVariants> & {
      asChild?: boolean;
    }
> = ({ asChild = false, className, variant = 'default', ...props }) => {
  const Component = asChild ? Slot_Text : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
};
```

**Pattern:**

- Same CVA pattern as web
- Uses React Native `Text` instead of HTML
- `Platform.select()` for platform-specific styles
- NativeWind for Tailwind classes

---

## 5. Styling Patterns & Conventions

### 5.1 Tailwind CSS Configuration

#### Web Configuration

**File:** `apps/web/src/app/globals.css`

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  /* ... more CSS variables */
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  /* ... dark mode overrides */
}
```

**Pattern:**

- CSS variables for theme values
- OKLCH color space for better color interpolation
- Dark mode via `.dark` class

#### Mobile Configuration

**File:** `apps/mobile/global.css`

```css
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import 'nativewind/theme';

@layer theme {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    /* HSL color space for mobile */
  }

  .dark:root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* Dark mode values */
  }
}
```

**Pattern:**

- HSL color space (NativeWind compatible)
- Same variable names as web
- NativeWind integration

### 5.2 The cn() Utility Pattern

**File:** `apps/web/src/lib/utils.ts` & `apps/mobile/src/lib/cn.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
```

**Purpose:**

1. `clsx` → Conditionally join class names
2. `twMerge` → Merge Tailwind classes intelligently

**Usage Examples:**

```typescript
// Conditional classes
cn('base-class', isActive && 'active-class', 'always-present')

// Merging with overrides
cn('p-4 bg-red-500', 'bg-blue-500') // → "p-4 bg-blue-500"

// In components
<div className={cn('default-styles', className)} />
```

**Pattern:** Always use `cn()` when combining class names

### 5.3 Styling Component Variants

**Pattern:** Use CVA (Class Variance Authority)

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      // Variant options
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-background',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Usage
<button className={buttonVariants({ variant: 'outline', size: 'lg' })} />;
```

**When to Use CVA:**

- Component has multiple visual states
- Need type-safe variant props
- Want to avoid inline conditionals

### 5.4 Responsive Design Patterns

```typescript
// Tailwind responsive classes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Mobile: Platform-specific
className={cn(
  'p-4',
  Platform.select({
    ios: 'shadow-sm',
    android: 'elevation-2',
  })
)}
```

**Breakpoints (Web):**

- `sm:` → 640px
- `md:` → 768px
- `lg:` → 1024px
- `xl:` → 1280px

### 5.5 Dark Mode Pattern

**Web:**

```typescript
// Automatic via system preference
<html className={isDark ? 'dark' : ''}>
  <body className="bg-background text-foreground">{children}</body>
</html>
```

**Mobile:**

```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';

const MyComponent = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className={colorScheme === 'dark' ? 'dark' : ''}>
      <Text className="text-foreground">Hello</Text>
    </View>
  );
};
```

---

## 6. State Management Patterns

### 6.1 Server State (GraphQL Data)

**Pattern:** Apollo Client manages all server state

```typescript
const { data, loading, error } = useQuery(SITE_DIARIES);
const [createDiary] = useMutation(CREATE_SITE_DIARY);

// No Redux, no Zustand needed for server data!
```

**Why This Works:**

- Apollo Client has built-in cache
- Automatic refetching
- Optimistic updates
- Cache normalization

### 6.2 Client State (UI State)

**Pattern:** React hooks for local UI state

```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Form state
const [formData, setFormData] = useState({
  title: '',
  date: '',
  createdBy: '',
});

// Derived state
const isValid = formData.title && formData.date && formData.createdBy;
```

**When to Use:**

- Form inputs
- Modal open/closed
- Accordion expanded/collapsed
- Filters and toggles

### 6.3 Context Pattern (Shared State)

**Example:** Theme provider

```typescript
// Context definition
const ThemeContext = React.createContext<
  | {
      theme: 'light' | 'dark';
      setTheme: (theme: 'light' | 'dark') => void;
    }
  | undefined
>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

**When to Use Context:**

- Theme/color scheme
- Authentication state
- Language/i18n
- Anything needed deeply in component tree

**Pattern:** No global state library needed for this project!

---

## 7. Type Safety & Code Generation

### 7.1 The Type Generation Pipeline

```
TypeScript Types (Grats annotations)
           ↓
    GraphQL Schema (generated by Grats)
           ↓
    Frontend Types (generated by GraphQL Codegen)
           ↓
    Fully Type-Safe Frontend
```

### 7.2 Using Generated Types

**Import Pattern:**

```typescript
import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
  SiteDiary,
} from '@/types/__generated__/graphql';
```

**Usage in Hooks:**

```typescript
const { data } = useQuery<SiteDiariesQuery, SiteDiariesQueryVariables>(
  SITE_DIARIES,
);

// data is fully typed!
data.siteDiaries; // ← Array<SiteDiary>
data.siteDiaries[0].id; // ← string
data.siteDiaries[0].weather?.temperature; // ← number | null | undefined
```

**Pattern:** Always type your GraphQL hooks!

### 7.3 Type-Safe Mutations

```typescript
import {
  CreateSiteDiaryMutation,
  CreateSiteDiaryMutationVariables,
  SiteDiaryInput,
} from '@/types/__generated__/graphql';

const [createDiary] = useMutation<
  CreateSiteDiaryMutation,
  CreateSiteDiaryMutationVariables
>(CREATE_SITE_DIARY);

// TypeScript ensures correct input shape
const input: SiteDiaryInput = {
  id: '123',
  date: '2025-10-22',
  title: 'New Entry',
  createdBy: 'User',
};

await createDiary({ variables: { input } });
```

### 7.4 Regenerating Types After Schema Changes

**Workflow:**

```bash
cd apps/web

# 1. Modify backend types/resolvers (with Grats annotations)
# 2. Regenerate schema
yarn grats

# 3. Regenerate frontend types
yarn codegen

# TypeScript will now error if frontend doesn't match!
```

**Key Principle:** Type errors guide you to update frontend code

---

## 8. Routing Patterns

### 8.1 Web Routing (Next.js App Router)

**Pattern:** File-based routing in `app/` directory

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── (tabs)/               → Route group (no URL segment)
│   ├── _layout.tsx       → Layout for group
│   └── (home)/
│       └── page.tsx      → /home
└── api/
    └── graphql/
        └── route.ts      → /api/graphql
```

**Key Patterns:**

- `page.tsx` → Page component
- `layout.tsx` → Layout wrapper
- `(folder)` → Route group (no URL impact)
- `api/` → API routes

**Example Page:**

```typescript
// app/about/page.tsx
const AboutPage: React.FC = () => {
  return <div>About Us</div>;
};

export default AboutPage;
```

**Example Layout:**

```typescript
// app/layout.tsx
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html>
      <body>
        <nav>Navigation</nav>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
};

export default RootLayout;
```

### 8.2 Mobile Routing (Expo Router)

**Pattern:** File-based routing in `app/` directory

```
app/
├── _layout.tsx           → Root layout
├── (tabs)/               → Tab navigation
│   ├── _layout.tsx       → Tab layout
│   └── (home)/
│       ├── _layout.tsx   → Stack layout
│       └── index.tsx     → Home screen
└── +not-found.tsx        → 404 screen
```

**Example Screen:**

```typescript
// app/(tabs)/(home)/index.tsx
const IndexScreen: React.FC = () => {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

IndexScreen.displayName = 'IndexScreen';

export default IndexScreen;
```

**Example Tab Layout:**

```typescript
// app/(tabs)/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

const TabLayout: React.FC = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
```

**Navigation Pattern:**

```typescript
import { useRouter } from 'expo-router';

const MyScreen = () => {
  const router = useRouter();

  return <Button onPress={() => router.push('/details')}>Go to Details</Button>;
};
```

---

## 9. Error Handling Patterns

### 9.1 GraphQL Error Handling

```typescript
const { data, loading, error } = useQuery(SITE_DIARIES);

if (loading) return <LoadingSpinner />;

if (error) {
  return <ErrorMessage>Failed to load diaries: {error.message}</ErrorMessage>;
}

return <DiaryList data={data.siteDiaries} />;
```

**Pattern:** Handle loading and error states explicitly

### 9.2 Mutation Error Handling

```typescript
const [createDiary, { loading, error }] = useMutation(CREATE_SITE_DIARY);

const handleSubmit = async () => {
  try {
    await createDiary({
      variables: { input: formData },
      refetchQueries: [SITE_DIARIES], // Refresh list
    });

    toast.success('Diary created!');
  } catch (err) {
    console.error('Failed to create diary:', err);
    toast.error('Failed to create diary');
  }
};
```

**Pattern:** Try/catch for mutation errors + refetch queries

### 9.3 Error Boundaries (React)

**Web Pattern:**

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Mobile Pattern:**

```typescript
// app/_layout.tsx
export { ErrorBoundary } from 'expo-router';
```

---

## 10. File Organization & Naming Conventions

### 10.1 Directory Structure Conventions

```
src/
├── app/                  # Pages & API routes
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── feature-name/    # Feature-specific components
├── lib/                 # Utilities & clients
├── graphql/             # GraphQL queries/mutations
├── data/                # Data layer & types
├── hooks/               # Custom React hooks
└── types/
    └── __generated__/   # Auto-generated types (don't edit!)
```

### 10.2 File Naming Conventions

| Type      | Convention   | Example                  |
| --------- | ------------ | ------------------------ |
| Component | kebab-case   | `user-profile.tsx`       |
| Page      | `page.tsx`   | `app/about/page.tsx`     |
| Layout    | `layout.tsx` | `app/layout.tsx`         |
| API Route | `route.ts`   | `app/api/users/route.ts` |
| Hook      | `use-*.ts`   | `use-user.ts`            |
| Utility   | kebab-case   | `format-date.ts`         |
| Type      | kebab-case   | `site-diary.ts`          |
| GraphQL   | kebab-case   | `site-diary-queries.ts`  |

### 10.3 Import Path Conventions

**Pattern:** Use absolute imports with `@/` alias

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { SITE_DIARIES } from '@/graphql/queries';
import { cn } from '@/lib/utils';
// ❌ Bad
import { Button } from '../../../components/ui/button';
```

**Configuration:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 10.4 Component Export Patterns

```typescript
// ✅ Named export for reusable components
export const Button = () => {
  /* ... */
};

// ✅ Default export for pages
const HomePage = () => {
  /* ... */
};
export default HomePage;

// ✅ Export variants for flexibility
export { Button, buttonVariants };
```

---

## 11. Backend Integration Workflow

### 11.1 Adding a New GraphQL Query

**Step 1:** Define resolver with Grats annotation

```typescript
// apps/web/src/app/api/graphql/query.ts

/** @gqlQueryField */
export function siteDiaryByDate(date: string): Array<SiteDiary> {
  return siteDiaries.filter((diary) => diary.date === date);
}
```

**Step 2:** Regenerate schema

```bash
cd apps/web
yarn grats
```

**Step 3:** Define frontend query

```typescript
// apps/web/src/graphql/queries.ts

export const SITE_DIARIES_BY_DATE = gql`
  query SiteDiariesByDate($date: String!) {
    siteDiaryByDate(date: $date) {
      id
      title
      date
      createdBy
    }
  }
`;
```

**Step 4:** Generate types

```bash
yarn codegen
```

**Step 5:** Use in component

```typescript
import { SITE_DIARIES_BY_DATE } from '@/graphql/queries';
import {
  SiteDiariesByDateQuery,
  SiteDiariesByDateQueryVariables,
} from '@/types/__generated__/graphql';

const DiariesByDate: React.FC = () => {
  const { data } = useQuery<
    SiteDiariesByDateQuery,
    SiteDiariesByDateQueryVariables
  >(SITE_DIARIES_BY_DATE, {
    variables: { date: '2025-10-22' },
  });

  return <div>{/* Render data */}</div>;
};
```

### 11.2 Adding a New GraphQL Mutation

**Step 1:** Define input type and mutation

```typescript
// apps/web/src/app/api/graphql/mutation.ts

/** @gqlInput */
interface UpdateSiteDiaryInput {
  id: string;
  title?: string;
  content?: string;
}

/** @gqlMutationField */
export function updateSiteDiary(input: UpdateSiteDiaryInput): SiteDiary | null {
  const index = siteDiaries.findIndex((d) => d.id === input.id);
  if (index === -1) return null;

  siteDiaries[index] = { ...siteDiaries[index], ...input };
  return siteDiaries[index];
}
```

**Step 2:** Regenerate schema

```bash
yarn grats
```

**Step 3:** Define frontend mutation

```typescript
// apps/web/src/graphql/mutations.ts

export const UPDATE_SITE_DIARY = gql`
  mutation UpdateSiteDiary($input: UpdateSiteDiaryInput!) {
    updateSiteDiary(input: $input) {
      id
      title
      content
    }
  }
`;
```

**Step 4:** Generate types

```bash
yarn codegen
```

**Step 5:** Use in component

```typescript
const [updateDiary] = useMutation<
  UpdateSiteDiaryMutation,
  UpdateSiteDiaryMutationVariables
>(UPDATE_SITE_DIARY);

const handleUpdate = async () => {
  await updateDiary({
    variables: {
      input: { id: '123', title: 'Updated Title' },
    },
    refetchQueries: [SITE_DIARIES],
  });
};
```

### 11.3 Adding a REST Endpoint

**Step 1:** Create route handler

```typescript
// apps/web/src/app/api/diaries/search/route.ts

import { siteDiaries } from '@/data/site-diary';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const results = siteDiaries.filter((diary) =>
    diary.title.toLowerCase().includes(query?.toLowerCase() || ''),
  );

  return NextResponse.json(results);
}
```

**Step 2:** Use in frontend

```typescript
const searchDiaries = async (query: string) => {
  const response = await fetch(`/api/diaries/search?q=${query}`);
  const data = await response.json();
  return data;
};
```

**Pattern:** REST endpoints are just Next.js route handlers

---

## 12. Best Practices & Common Patterns

### 12.1 Component Composition

**Pattern:** Compound components

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Benefits:**

- Flexible API
- Encapsulation
- Reusability

### 12.2 Custom Hook Pattern

```typescript
// hooks/use-site-diaries.ts

import { SITE_DIARIES } from '@/graphql/queries';
import { useQuery } from '@apollo/client';

export const useSiteDiaries = () => {
  const { data, loading, error } = useQuery(SITE_DIARIES);

  return {
    diaries: data?.siteDiaries ?? [],
    isLoading: loading,
    error,
  };
};

// Usage
const { diaries, isLoading } = useSiteDiaries();
```

**When to Create Hooks:**

- Reuse logic across components
- Complex state management
- Side effect encapsulation

### 12.3 Optimistic Updates

```typescript
const [deleteDiary] = useMutation(DELETE_SITE_DIARY, {
  optimisticResponse: {
    deleteSiteDiary: true,
  },
  update(cache, { data }) {
    if (data?.deleteSiteDiary) {
      cache.modify({
        fields: {
          siteDiaries(existingRefs, { readField }) {
            return existingRefs.filter(
              (ref) => readField('id', ref) !== deletedId,
            );
          },
        },
      });
    }
  },
});
```

**Pattern:** Update cache immediately for better UX

### 12.4 Loading States

```typescript
// Skeleton pattern
{
  loading ? (
    <div className="animate-pulse">
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
    </div>
  ) : (
    <div>{data.title}</div>
  );
}
```

### 12.5 Environment Variables

**Web Pattern:**

```typescript
// Must prefix with NEXT_PUBLIC_ for client-side
const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;
```

**Mobile Pattern:**

```typescript
// Must prefix with EXPO_PUBLIC_ for client-side
const apiUrl = process.env.EXPO_PUBLIC_API_GRAPHQL_URL;
```

**Pattern:** Environment variables for configuration, never hardcode URLs

---

## 13. Mobile-Specific Patterns

### 13.1 Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = Platform.select({
  ios: { paddingTop: 20 },
  android: { paddingTop: 0 },
  web: { paddingTop: 10 },
});

// Or inline
<View
  style={{
    ...Platform.select({
      ios: { shadowOpacity: 0.3 },
      android: { elevation: 5 },
    }),
  }}
/>;
```

### 13.2 Safe Area Handling

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

const Screen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Content respects notches and home indicators */}
    </SafeAreaView>
  );
};
```

### 13.3 Gesture Handling

```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Wrap entire app
<GestureHandlerRootView>
  <App />
</GestureHandlerRootView>;
```

### 13.4 ScrollView Pattern

```typescript
import { ScrollView } from 'react-native-gesture-handler';

<ScrollView
  automaticallyAdjustsScrollIndicatorInsets={true}
  contentInsetAdjustmentBehavior="automatic"
>
  <View>{/* Content */}</View>
</ScrollView>;
```

---

## 14. Development Workflow

### 14.1 Daily Development Flow

```bash
# 1. Start development server
yarn dev:web    # For web
yarn dev:mobile # For mobile

# 2. Make changes to code

# 3. If you changed GraphQL schema:
cd apps/web
yarn grats      # Regenerate GraphQL schema
yarn codegen    # Regenerate TypeScript types

# 4. Check for errors
yarn typecheck  # Type errors
yarn lint       # Lint errors

# 5. Format code
yarn format
```

### 14.2 Adding Dependencies

```bash
# Add to web
cd apps/web
yarn add package-name

# Add to mobile
cd apps/mobile
yarn add package-name

# Add dev dependency
yarn add -D package-name
```

### 14.3 Testing GraphQL Changes

**Option 1:** GraphiQL Playground

1. Start dev server: `yarn dev:web`
2. Open `http://localhost:3000/api/graphql`
3. Test queries interactively

**Option 2:** Postman

1. POST to `http://localhost:3000/api/graphql`
2. Body: `{ "query": "...", "variables": {...} }`

### 14.4 Debugging Tips

**Web:**

```typescript
// Add console logs
console.log('Data:', data);

// Use React DevTools
// Apollo DevTools extension

// Check Network tab for GraphQL requests
```

**Mobile:**

```typescript
// Remote debugging
// Open dev menu: Cmd+D (iOS) / Cmd+M (Android)
// Enable "Remote JS Debugging"

// Use React Native Debugger
// Flipper for advanced debugging
```

---

## 15. Quick Reference Cheat Sheet

### GraphQL Workflow

```bash
# 1. Modify backend types (with @gqlType, @gqlField)
# 2. Regenerate schema
yarn grats

# 3. Update frontend queries
# 4. Regenerate types
yarn codegen

# 5. Use types in components
```

### Component Creation

```typescript
// 1. Create file
// apps/web/src/components/my-component.tsx

// 2. Define component
import { cn } from '@/lib/utils';

export const MyComponent: React.FC<{ className?: string }> = ({
  className,
}) => {
  return <div className={cn('base-styles', className)}>Content</div>;
};

// 3. Export
export default MyComponent;
```

### Styling

```typescript
// Base classes
className="flex items-center gap-2"

// Responsive
className="grid grid-cols-1 md:grid-cols-2"

// Dark mode
className="bg-background text-foreground"

// Conditional
className={cn('base', isActive && 'active')}

// Variants (CVA)
const variants = cva('base', {
  variants: { size: { sm: '...', lg: '...' } }
});
```

### GraphQL Hooks

```typescript
// Query
const { data, loading, error } = useQuery<QueryType, VariablesType>(QUERY);

// Mutation
const [mutate, { loading }] = useMutation<MutationType, VariablesType>(
  MUTATION,
);

// Suspense Query (web only)
const { data } = useSuspenseQuery<QueryType, VariablesType>(QUERY);
```

### Imports Cheat Sheet

```typescript
// Components
import { Button } from '@/components/ui/button';
// GraphQL
import { SITE_DIARIES } from '@/graphql/queries';
// Utils
import { cn } from '@/lib/utils';
// Types
import { SiteDiary } from '@/types/__generated__/graphql';
// Apollo
import { useMutation, useQuery } from '@apollo/client';
// Expo
import { useRouter } from 'expo-router';
// Next.js
import { useRouter } from 'next/navigation';
```

### Common Commands

```bash
# Development
yarn dev:web
yarn dev:mobile

# Code generation
yarn grats       # GraphQL schema
yarn codegen     # TypeScript types

# Quality
yarn lint
yarn typecheck
yarn format

# Build
cd apps/web && yarn build
cd apps/mobile && yarn ios
```

---

## Conclusion

This guide covers all the major patterns used in the Site Diary project. Key takeaways:

1. **Type Safety First:** Everything is typed from backend to frontend
2. **GraphQL as API Layer:** Apollo Client handles all data fetching
3. **Component-Driven:** Build with reusable, composable components
4. **Tailwind for Styling:** Utility-first CSS with shared design tokens
5. **Monorepo Benefits:** Share code and types between web and mobile
6. **Convention Over Configuration:** Follow established patterns for consistency

When in doubt, look at existing code and follow the same patterns!

**Next Steps:**

- Read `developer-onboarding.md` for setup instructions
- Review `api-endpoints-reference.md` for API details
- Explore the codebase and identify patterns in action
- Ask questions and contribute to this documentation!

---

**Last Updated:** October 22, 2025  
**Maintained By:** Development Team  
**Questions?** Create an issue or update this doc!
