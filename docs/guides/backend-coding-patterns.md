# Backend Coding Patterns & Architecture Guide

**Project:** Site Diary Management System  
**Last Updated:** October 23, 2025  
**Target Audience:** New developers joining the project  
**Purpose:** Complete reference for backend patterns, API design, and data layer architecture

---

## 🚨 CRITICAL: Minimal Changes Philosophy

**Before implementing any backend feature:**

### Core Principles:

1. **Only modify necessary files** - Don't refactor or reorganize working code
2. **If endpoints work without errors, don't change them** - No errors = no changes
3. **Preserve existing endpoints** - Keep API contracts unchanged unless explicitly updating them
4. **Add new routes/resolvers** - Don't modify existing ones unless fixing a bug
5. **Test incrementally** - Verify each change with curl/GraphiQL before proceeding
6. **Follow existing patterns** - Match naming, structure, and error handling already in place

### Backend Refactoring Policy:

**ONLY refactor backend code when:**

- ✅ Prompt explicitly requests refactoring
- ✅ Fixing an actual bug or error in the API
- ✅ Existing code prevents implementing the requested feature
- ✅ Security vulnerability exists

**DO NOT refactor when:**

- ❌ API endpoints are working correctly (returning proper responses)
- ❌ No errors or issues in logs
- ❌ Code "could be organized better" but works
- ❌ Validation works but "could be improved"
- ❌ Error handling works but "could be more detailed"

### Backend-Specific Guidelines:

- ✅ Add new GraphQL mutations/queries alongside existing ones
- ✅ Create new API routes in new files when possible
- ✅ Keep data layer changes isolated and minimal
- ❌ Don't restructure working resolvers "for better organization"
- ❌ Don't change error handling patterns that work
- ❌ Don't modify validation logic in unrelated endpoints
- ❌ Don't refactor working mutations/queries

**Remember:** Backend changes affect all clients. Minimal changes = minimal breaking changes.
**Working API > "Perfect" API - Stability is priority #1.**

---

## Table of Contents

1. [Backend Architecture Overview](#1-backend-architecture-overview)
2. [Next.js API Routes Pattern](#2-nextjs-api-routes-pattern)
3. [GraphQL Backend with Grats](#3-graphql-backend-with-grats)
4. [Data Layer Architecture](#4-data-layer-architecture)
5. [REST API Patterns](#5-rest-api-patterns)
6. [Type Definition Patterns](#6-type-definition-patterns)
7. [Resolver Patterns](#7-resolver-patterns)
8. [Error Handling Patterns](#8-error-handling-patterns)
9. [Middleware & Authentication](#9-middleware--authentication)
10. [Validation Patterns](#10-validation-patterns)
11. [Database Integration (Future)](#11-database-integration-future)
12. [API Design Best Practices](#12-api-design-best-practices)
13. [Testing Backend Code](#13-testing-backend-code)
14. [Performance Considerations](#14-performance-considerations)
15. [Backend Development Workflow](#15-backend-development-workflow)
16. [Quick Reference Cheat Sheet](#16-quick-reference-cheat-sheet)

---

## 1. Backend Architecture Overview

### 1.1 Architecture Philosophy

This project uses **Next.js as a full-stack framework**, where backend and frontend coexist:

```
Next.js Application
├── Frontend (React Components)
│   └── src/app/page.tsx
│
└── Backend (API Routes)
    └── src/app/api/
        ├── graphql/      # GraphQL API
        └── site-diary/   # REST API
```

**Key Principle:** Co-located backend and frontend with shared TypeScript types

### 1.2 Backend Technology Stack

| Technology       | Version | Purpose                              |
| ---------------- | ------- | ------------------------------------ |
| **Next.js**      | 15.5.6  | Full-stack framework & API routes    |
| **GraphQL Yoga** | 5.16.0  | GraphQL server implementation        |
| **Grats**        | 0.0.34  | Schema-first GraphQL from TypeScript |
| **TypeScript**   | 5.9.3   | Type safety across the stack         |

### 1.3 API Architecture

**Two API Approaches:**

1. **GraphQL API** (`/api/graphql`) - Primary data API
   - Schema generated from TypeScript types
   - Type-safe queries and mutations
   - Single endpoint for all operations

2. **REST API** (`/api/site-diary`) - Alternative HTTP API
   - Traditional REST endpoints
   - Resource-based URLs
   - Standard HTTP methods

**Pattern:** Both APIs access the same data layer

```
┌─────────────────────────────────────────┐
│          Client (Web/Mobile)            │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐
│GraphQL │      │   REST   │
│  API   │      │   API    │
└───┬────┘      └────┬─────┘
    │                │
    └────────┬───────┘
             │
    ┌────────▼────────┐
    │   Data Layer    │
    │ (In-Memory)     │
    └─────────────────┘
```

### 1.4 Project Structure (Backend Files)

```
apps/web/src/
├── app/
│   └── api/                           # API Routes
│       ├── graphql/                   # GraphQL Endpoint
│       │   ├── route.ts              # HTTP handler
│       │   ├── schema.ts             # Generated schema (DON'T EDIT)
│       │   ├── schema.graphql        # Generated SDL
│       │   ├── query.ts              # Query resolvers
│       │   └── mutation.ts           # Mutation resolvers
│       │
│       └── site-diary/                # REST Endpoints
│           ├── route.ts              # GET all, POST create
│           └── [id]/
│               └── route.ts          # GET by ID
│
├── data/
│   └── site-diary.ts                 # Data layer & types
│
└── middleware.ts                      # Request middleware
```

---

## 2. Next.js API Routes Pattern

### 2.1 File-Based Routing for APIs

**Pattern:** Files in `app/api/` become API endpoints

```
app/api/
├── users/
│   └── route.ts          → /api/users
├── users/
│   └── [id]/
│       └── route.ts      → /api/users/:id
└── graphql/
    └── route.ts          → /api/graphql
```

**Key Convention:** File must be named `route.ts` (or `.js`)

### 2.2 Route Handler Pattern

**Basic Structure:**

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  // Handle POST request
  const body = await request.json();
  return NextResponse.json({ received: body });
}

export async function PUT(request: NextRequest) {
  // Handle PUT request
}

export async function DELETE(request: NextRequest) {
  // Handle DELETE request
}
```

**Pattern:**

- Export named functions for HTTP methods
- `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`
- Each function is independent

### 2.3 Request Handling

#### Accessing Request Data

```typescript
export async function POST(request: NextRequest) {
  // 1. URL and query parameters
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // 2. Request body (JSON)
  const body = await request.json();

  // 3. Headers
  const authHeader = request.headers.get('authorization');

  // 4. Cookies
  const sessionCookie = request.cookies.get('session');

  return NextResponse.json({ query, body });
}
```

#### Dynamic Route Parameters

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Use the id parameter
  const user = await findUserById(id);

  return NextResponse.json(user);
}
```

**Pattern:** Dynamic segments use `[param]` syntax, accessed via `params`

### 2.4 Response Patterns

#### JSON Response

```typescript
return NextResponse.json(
  { data: 'value' },
  {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  },
);
```

#### Error Response

```typescript
return NextResponse.json({ error: 'Not found' }, { status: 404 });
```

#### Redirect Response

```typescript
return NextResponse.redirect(new URL('/login', request.url));
```

#### Custom Headers

```typescript
const response = NextResponse.json({ data: 'value' });
response.headers.set('X-Custom-Header', 'value');
return response;
```

### 2.5 Real Example: Site Diary REST API

**File:** `apps/web/src/app/api/site-diary/route.ts`

```typescript
import { siteDiaries } from '@/data/site-diary';
import { NextRequest, NextResponse } from 'next/server';
import { SiteDiary } from '../../../data/site-diary';

// GET /api/site-diary - List all diaries
export async function GET() {
  const diaries = siteDiaries.map((entry) => {
    return {
      id: entry.id,
      date: entry.date,
      title: entry.title,
      createdBy: entry.createdBy,
    };
  });

  return NextResponse.json(diaries, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST /api/site-diary - Create new diary
export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Validation
    if (
      !siteDiary.id ||
      !siteDiary.date ||
      !siteDiary.createdBy ||
      !siteDiary.title
    ) {
      throw new Error('id, date, createdBy and title are required');
    }

    // ⚠️ BUG: Should save to array here
    // siteDiaries.push(siteDiary);

    return NextResponse.json(
      { message: 'Site diary created successfully', siteDiary },
      { status: 201 },
    );
  } catch (e: unknown) {
    let errorMessage = 'Unknown error';

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    return NextResponse.json(
      { error: 'Invalid request format', errorMessage },
      { status: 400 },
    );
  }
}
```

**Pattern Breakdown:**

1. Import data layer
2. Export HTTP method handlers
3. Transform data if needed (e.g., return subset of fields)
4. Handle errors with try/catch
5. Return proper status codes

**File:** `apps/web/src/app/api/site-diary/[id]/route.ts`

```typescript
import { siteDiaries } from '@/data/site-diary';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/site-diary/:id - Get single diary
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  const entry = siteDiaries.find((entry) => entry.id === id);

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json(entry, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Pattern:** Use `find()` to locate resource, return 404 if not found

---

## 3. GraphQL Backend with Grats

### 3.1 What is Grats?

**Grats** is a GraphQL schema generator that creates schemas from TypeScript code using JSDoc annotations.

**Philosophy:** Code-first GraphQL without decorators or separate schema files

**Benefits:**

- ✅ Single source of truth (TypeScript types)
- ✅ No schema duplication
- ✅ Full TypeScript type safety
- ✅ Auto-generates resolver types
- ✅ Changes to types automatically update schema

### 3.2 Grats Annotation Reference

| Annotation                 | Purpose                    | Use Case              |
| -------------------------- | -------------------------- | --------------------- |
| `/** @gqlType */`          | Define GraphQL object type | Data models           |
| `/** @gqlField */`         | Define field on type       | Properties            |
| `/** @gqlQueryField */`    | Create Query root field    | Read operations       |
| `/** @gqlMutationField */` | Create Mutation root field | Write operations      |
| `/** @gqlInput */`         | Define input object type   | Mutation inputs       |
| `/** @gqlInterface */`     | Define interface type      | Shared fields         |
| `/** @gqlUnion */`         | Define union type          | Multiple return types |

### 3.3 Defining GraphQL Types with Grats

#### Basic Type Pattern

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
```

**Generated GraphQL:**

```graphql
type Weather {
  temperature: Int!
  description: String!
}
```

**Key Patterns:**

- Use `type` (not `interface`) for GraphQL types
- Add `/** @gqlType */` before type definition
- Add `/** @gqlField */` before each exposed field
- Use `Int` type from `grats` for integers

#### Complex Type with Nested Objects

```typescript
/** @gqlType */
export type SiteDiary = {
  /** @gqlField */
  id: string;

  /** @gqlField */
  date: string;

  /** @gqlField */
  weather?: Weather; // Optional nested object

  /** @gqlField */
  createdBy: string;

  /** @gqlField */
  title: string;

  /** @gqlField */
  content?: string; // Optional field

  /** @gqlField */
  attendees?: string[]; // Optional array

  /** @gqlField */
  attachments?: string[];
};
```

**Generated GraphQL:**

```graphql
type SiteDiary {
  id: String!
  date: String!
  weather: Weather
  createdBy: String!
  title: String!
  content: String
  attendees: [String!]
  attachments: [String!]
}
```

**Type Mapping:**

- `string` → `String!`
- `string?` → `String`
- `Int` → `Int!`
- `string[]` → `[String!]`
- `string[]?` → `[String!]` (nullable array)

#### Input Types

```typescript
/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
}
```

**Generated GraphQL:**

```graphql
input SiteDiaryInput {
  id: String!
  date: String!
  createdBy: String!
  title: String!
}
```

**Pattern:** Use `interface` for input types, `type` for output types

### 3.4 Query Resolvers

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

**Generated GraphQL:**

```graphql
type Query {
  siteDiaries: [SiteDiary!]!
  siteDiary(id: String!): SiteDiary
}
```

**Pattern Rules:**

1. Export function with `/** @gqlQueryField */`
2. Function name becomes field name (can customize)
3. Parameters become arguments
4. Return type becomes field type
5. Nullable return = nullable field

#### Advanced Query Patterns

**With Multiple Arguments:**

```typescript
/** @gqlQueryField */
export function siteDiariesByDateRange(
  startDate: string,
  endDate: string,
): Array<SiteDiary> {
  return siteDiaries.filter((d) => d.date >= startDate && d.date <= endDate);
}
```

**With Optional Arguments:**

```typescript
/** @gqlQueryField */
export function siteDiariesByCreator(
  createdBy: string,
  limit?: Int,
): Array<SiteDiary> {
  const filtered = siteDiaries.filter((d) => d.createdBy === createdBy);
  return limit ? filtered.slice(0, limit) : filtered;
}
```

**Custom Field Name:**

```typescript
/**
 * @gqlQueryField
 * @gqlField getAllDiaries - Custom name
 */
export function siteDiaries(): Array<SiteDiary> {
  return rawSiteDiaries;
}
```

### 3.5 Mutation Resolvers

**File:** `apps/web/src/app/api/graphql/mutation.ts`

```typescript
import { SiteDiary } from '@/data/site-diary';

/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  // ⚠️ Current implementation (has bug)
  return input;

  // ✅ Correct implementation:
  // const newDiary: SiteDiary = { ...input };
  // siteDiaries.push(newDiary);
  // return newDiary;
}
```

**Generated GraphQL:**

```graphql
type Mutation {
  createSiteDiary(input: SiteDiaryInput!): SiteDiary!
}
```

**Pattern:** Mutations follow same rules as queries but use `@gqlMutationField`

#### Complete Mutation Example

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';
import { nanoid } from 'nanoid';

/** @gqlInput */
interface CreateSiteDiaryInput {
  date: string;
  title: string;
  createdBy: string;
  content?: string;
}

/** @gqlMutationField */
export function createSiteDiary(input: CreateSiteDiaryInput): SiteDiary {
  const newDiary: SiteDiary = {
    id: nanoid(), // Auto-generate ID
    date: input.date,
    title: input.title,
    createdBy: input.createdBy,
    content: input.content,
  };

  siteDiaries.push(newDiary);
  return newDiary;
}

/** @gqlInput */
interface UpdateSiteDiaryInput {
  id: string;
  title?: string;
  content?: string;
}

/** @gqlMutationField */
export function updateSiteDiary(input: UpdateSiteDiaryInput): SiteDiary | null {
  const index = siteDiaries.findIndex((d) => d.id === input.id);

  if (index === -1) {
    return null;
  }

  siteDiaries[index] = {
    ...siteDiaries[index],
    ...input,
  };

  return siteDiaries[index];
}

/** @gqlMutationField */
export function deleteSiteDiary(id: string): boolean {
  const index = siteDiaries.findIndex((d) => d.id === id);

  if (index === -1) {
    return false;
  }

  siteDiaries.splice(index, 1);
  return true;
}
```

**Mutation Patterns:**

- **Create:** Generate ID, add to array, return object
- **Update:** Find by ID, merge changes, return updated object
- **Delete:** Find by ID, remove from array, return boolean

### 3.6 Schema Generation

**Generate Schema:**

```bash
cd apps/web
yarn grats
```

**Output Files:**

1. `schema.ts` - Executable GraphQL schema (JavaScript code)
2. `schema.graphql` - Schema Definition Language (SDL)

**schema.ts (Generated - Don't Edit!):**

```typescript
/**
 * Executable schema generated by Grats (https://grats.capt.dev)
 * Do not manually edit. Regenerate by running `npx grats`.
 */

import { GraphQLObjectType /* ... */, GraphQLSchema } from 'graphql';
import { createSiteDiary as mutationCreateSiteDiaryResolver } from './mutation';
import { siteDiaries as querySiteDiariesResolver /* ... */ } from './query';

export function getSchema(): GraphQLSchema {
  const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields() {
      return {
        description: {
          name: 'description',
          type: new GraphQLNonNull(GraphQLString),
        },
        temperature: {
          name: 'temperature',
          type: new GraphQLNonNull(GraphQLInt),
        },
      };
    },
  });

  // ... more type definitions

  return new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
    types: [
      /* ... */
    ],
  });
}
```

**Pattern:** Grats generates executable schema code from your TypeScript

### 3.7 GraphQL Server Setup

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

1. Import schema from generated file
2. Create Yoga instance with schema
3. Export HTTP method handlers
4. Delegate all requests to Yoga

**GraphQL Yoga Features:**

- Built-in GraphiQL playground
- Automatic CORS handling
- Error formatting
- File uploads support
- Subscriptions support

---

## 4. Data Layer Architecture

### 4.1 Current Implementation: In-Memory Storage

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

// In-memory data store
export const siteDiaries: SiteDiary[] = [
  {
    id: 'cm4lvx1rf00006fujdr7w5u9h',
    date: '2024-12-13',
    weather: {
      temperature: 20,
      description: 'sunny',
    },
    createdBy: 'John Doe',
    title: 'Test',
    content: 'Site diary entry to discuss the activities of the day',
    attendees: ['Jane Smith', 'John Doe'],
    attachments: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740',
    ],
  },
  // ... more entries
];
```

**Pattern:**

- Types and data in same file
- Types annotated with Grats
- Data exported as mutable array
- Sample data for development

**⚠️ Limitations:**

- Data resets on server restart
- No persistence
- Not suitable for production
- No concurrent access handling

### 4.2 Data Access Patterns

#### Query Pattern (Read)

```typescript
// Get all
export function getAllDiaries(): SiteDiary[] {
  return siteDiaries;
}

// Get by ID
export function getDiaryById(id: string): SiteDiary | undefined {
  return siteDiaries.find((d) => d.id === id);
}

// Filter by criteria
export function getDiariesByDate(date: string): SiteDiary[] {
  return siteDiaries.filter((d) => d.date === date);
}

// Search
export function searchDiaries(query: string): SiteDiary[] {
  const lowerQuery = query.toLowerCase();
  return siteDiaries.filter(
    (d) =>
      d.title.toLowerCase().includes(lowerQuery) ||
      d.content?.toLowerCase().includes(lowerQuery),
  );
}
```

#### Mutation Pattern (Write)

```typescript
// Create
export function createDiary(input: CreateInput): SiteDiary {
  const newDiary: SiteDiary = {
    id: generateId(),
    ...input,
  };
  siteDiaries.push(newDiary);
  return newDiary;
}

// Update
export function updateDiary(
  id: string,
  updates: Partial<SiteDiary>,
): SiteDiary | null {
  const index = siteDiaries.findIndex((d) => d.id === id);
  if (index === -1) return null;

  siteDiaries[index] = {
    ...siteDiaries[index],
    ...updates,
  };
  return siteDiaries[index];
}

// Delete
export function deleteDiary(id: string): boolean {
  const index = siteDiaries.findIndex((d) => d.id === id);
  if (index === -1) return false;

  siteDiaries.splice(index, 1);
  return true;
}
```

### 4.3 Data Layer Separation Pattern

**Recommended Structure:**

```
data/
├── site-diary/
│   ├── types.ts         # Type definitions with @gqlType
│   ├── repository.ts    # Data access functions
│   └── seed-data.ts     # Sample data
```

**types.ts:**

```typescript
/** @gqlType */
export type SiteDiary = {
  /** @gqlField */
  id: string;
  // ... fields
};
```

**repository.ts:**

```typescript
import { seedData } from './seed-data';
import { SiteDiary } from './types';

let siteDiaries: SiteDiary[] = [...seedData];

export const SiteDiaryRepository = {
  findAll: () => siteDiaries,

  findById: (id: string) => siteDiaries.find((d) => d.id === id),

  create: (input: Partial<SiteDiary>) => {
    const diary = { id: generateId(), ...input } as SiteDiary;
    siteDiaries.push(diary);
    return diary;
  },

  update: (id: string, updates: Partial<SiteDiary>) => {
    const index = siteDiaries.findIndex((d) => d.id === id);
    if (index === -1) return null;
    siteDiaries[index] = { ...siteDiaries[index], ...updates };
    return siteDiaries[index];
  },

  delete: (id: string) => {
    const index = siteDiaries.findIndex((d) => d.id === id);
    if (index === -1) return false;
    siteDiaries.splice(index, 1);
    return true;
  },
};
```

**seed-data.ts:**

```typescript
import { SiteDiary } from './types';

export const seedData: SiteDiary[] = [
  {
    /* ... */
  },
  {
    /* ... */
  },
];
```

**Benefits:**

- Clear separation of concerns
- Easier to swap data source
- Better testability
- Repository pattern preparation for database

---

## 5. REST API Patterns

### 5.1 RESTful URL Design

**Conventions:**

```
GET    /api/resource          # List all
GET    /api/resource/:id      # Get single
POST   /api/resource          # Create
PUT    /api/resource/:id      # Update (full)
PATCH  /api/resource/:id      # Update (partial)
DELETE /api/resource/:id      # Delete
```

**Current Implementation:**

```
GET    /api/site-diary        # ✅ Implemented
GET    /api/site-diary/:id    # ✅ Implemented
POST   /api/site-diary        # ⚠️ Implemented (has bug)
PUT    /api/site-diary/:id    # ❌ Not implemented
DELETE /api/site-diary/:id    # ❌ Not implemented
```

### 5.2 HTTP Status Code Conventions

| Code    | Usage        | Example                |
| ------- | ------------ | ---------------------- |
| **200** | Success      | GET returns data       |
| **201** | Created      | POST creates resource  |
| **204** | No Content   | DELETE succeeds        |
| **400** | Bad Request  | Invalid input          |
| **404** | Not Found    | Resource doesn't exist |
| **500** | Server Error | Unhandled exception    |

### 5.3 Complete REST API Implementation

**GET All Pattern:**

```typescript
// app/api/site-diary/route.ts
export async function GET() {
  const diaries = siteDiaries.map((entry) => ({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    createdBy: entry.createdBy,
  }));

  return NextResponse.json(diaries, { status: 200 });
}
```

**Pattern:** Return subset of fields for list view

**GET Single Pattern:**

```typescript
// app/api/site-diary/[id]/route.ts
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const entry = siteDiaries.find((e) => e.id === id);

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json(entry, { status: 200 });
}
```

**Pattern:** Find resource, return 404 if not found

**POST Create Pattern:**

```typescript
// app/api/site-diary/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.date || !body.title || !body.createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Create
    const newDiary = {
      id: nanoid(),
      ...body,
    };

    siteDiaries.push(newDiary);

    return NextResponse.json(
      { message: 'Created successfully', data: newDiary },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

**Pattern:** Validate, create, return 201 with created resource

**PUT Update Pattern:**

```typescript
// app/api/site-diary/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const index = siteDiaries.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Full replacement
    siteDiaries[index] = {
      id, // Keep ID
      ...body,
    };

    return NextResponse.json(
      { message: 'Updated', data: siteDiaries[index] },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

**Pattern:** Replace entire resource (PUT = full update)

**PATCH Update Pattern:**

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const index = siteDiaries.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Partial update
    siteDiaries[index] = {
      ...siteDiaries[index],
      ...body,
    };

    return NextResponse.json(
      { message: 'Updated', data: siteDiaries[index] },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

**Pattern:** Merge changes (PATCH = partial update)

**DELETE Pattern:**

```typescript
// app/api/site-diary/[id]/route.ts
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const index = siteDiaries.findIndex((d) => d.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  siteDiaries.splice(index, 1);

  return NextResponse.json(
    { message: 'Deleted successfully' },
    { status: 200 },
  );
}
```

**Pattern:** Find and remove, return success message

---

## 6. Type Definition Patterns

### 6.1 TypeScript Type Patterns

**Basic Type:**

```typescript
export type SiteDiary = {
  id: string;
  title: string;
  date: string;
};
```

**With Optional Fields:**

```typescript
export type SiteDiary = {
  id: string;
  title: string;
  content?: string; // Optional
  weather?: Weather; // Optional nested
};
```

**With Arrays:**

```typescript
export type SiteDiary = {
  attendees?: string[]; // Optional array
  attachments: string[]; // Required array
};
```

**Union Types:**

```typescript
type Status = 'draft' | 'published' | 'archived';

export type SiteDiary = {
  status: Status;
};
```

**Enums:**

```typescript
enum DiaryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export type SiteDiary = {
  status: DiaryStatus;
};
```

### 6.2 Input Type Patterns

**Create Input (Partial):**

```typescript
export type CreateSiteDiaryInput = Omit<SiteDiary, 'id'>;
// Exclude auto-generated fields

export type CreateSiteDiaryInput = Pick<
  SiteDiary,
  'title' | 'date' | 'createdBy'
>;
// Only specific fields
```

**Update Input (All Optional):**

```typescript
export type UpdateSiteDiaryInput = Partial<Omit<SiteDiary, 'id'>> & {
  id: string; // ID required
};
```

**Utility Types:**

```typescript
// Make all fields optional
type PartialDiary = Partial<SiteDiary>;

// Make all fields required
type RequiredDiary = Required<SiteDiary>;

// Pick specific fields
type DiaryPreview = Pick<SiteDiary, 'id' | 'title' | 'date'>;

// Omit specific fields
type DiaryWithoutMeta = Omit<SiteDiary, 'createdBy' | 'createdAt'>;

// Readonly
type ImmutableDiary = Readonly<SiteDiary>;
```

### 6.3 Type Guards

```typescript
function isSiteDiary(value: unknown): value is SiteDiary {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'date' in value
  );
}

// Usage
if (isSiteDiary(data)) {
  // TypeScript knows data is SiteDiary
  console.log(data.title);
}
```

---

## 7. Resolver Patterns

### 7.1 Simple Resolver Pattern

```typescript
/** @gqlQueryField */
export function siteDiaries(): SiteDiary[] {
  return siteDiaries;
}
```

**Use When:** Direct data access, no transformation

### 7.2 Filtering Resolver Pattern

```typescript
/** @gqlQueryField */
export function siteDiariesByCreator(createdBy: string): SiteDiary[] {
  return siteDiaries.filter((d) => d.createdBy === createdBy);
}
```

**Use When:** Filtering based on criteria

### 7.3 Pagination Resolver Pattern

```typescript
/** @gqlQueryField */
export function siteDiariesPaginated(limit: Int, offset: Int): SiteDiary[] {
  return siteDiaries.slice(offset, offset + limit);
}
```

**Use When:** Large datasets need pagination

### 7.4 Resolver with Error Handling

```typescript
/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary | null {
  const diary = siteDiaries.find((d) => d.id === id);
  return diary || null; // Return null if not found
}
```

**Use When:** Resource may not exist

### 7.5 Async Resolver Pattern

```typescript
/** @gqlQueryField */
export async function siteDiary(id: string): Promise<SiteDiary | null> {
  // Simulating async operation (e.g., database query)
  const diary = await findDiaryById(id);
  return diary;
}
```

**Use When:** Database queries, external API calls

### 7.6 Resolver with Context

```typescript
type Context = {
  userId: string;
  isAdmin: boolean;
};

/** @gqlQueryField */
export function siteDiaries(args: {}, context: Context): SiteDiary[] {
  // Use context for authorization
  if (!context.isAdmin) {
    return siteDiaries.filter((d) => d.createdBy === context.userId);
  }
  return siteDiaries;
}
```

**Use When:** Need request context (auth, user info, etc.)

---

## 8. Error Handling Patterns

### 8.1 REST API Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.title) {
      return NextResponse.json(
        { error: 'Validation failed', details: 'Title is required' },
        { status: 400 },
      );
    }

    // Business logic
    const result = await createDiary(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // Catch unexpected errors
    console.error('Error creating diary:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
```

**Pattern:** Try/catch with specific error responses

### 8.2 Custom Error Classes

```typescript
// lib/errors.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

// Usage in route
export async function GET(request: NextRequest) {
  try {
    const diary = getDiaryById(id);
    if (!diary) {
      throw new NotFoundError('Diary');
    }
    return NextResponse.json(diary);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Unknown error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
```

### 8.3 GraphQL Error Handling

**GraphQL Yoga automatically handles errors:**

```typescript
/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary {
  const diary = siteDiaries.find((d) => d.id === id);

  if (!diary) {
    throw new Error(`Diary with id ${id} not found`);
  }

  return diary;
}
```

**Client receives:**

```json
{
  "errors": [
    {
      "message": "Diary with id abc123 not found",
      "path": ["siteDiary"]
    }
  ],
  "data": {
    "siteDiary": null
  }
}
```

**Custom GraphQL Errors:**

```typescript
import { GraphQLError } from 'graphql';

/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary {
  const diary = siteDiaries.find((d) => d.id === id);

  if (!diary) {
    throw new GraphQLError('Diary not found', {
      extensions: {
        code: 'NOT_FOUND',
        id: id,
      },
    });
  }

  return diary;
}
```

---

## 9. Middleware & Authentication

### 9.1 Next.js Middleware Pattern

**File:** `apps/web/src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_KEY = process.env.API_KEY;
const PROTECTED_PATHS = ['/api/site-diary'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if path is protected
  if (PROTECTED_PATHS.some((p) => path.startsWith(p))) {
    const providedKey = request.headers.get('x-api-key');

    if (providedKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // Run on all API routes
};
```

**Pattern:**

- Export `middleware` function
- Check request path
- Validate credentials
- Return response or `NextResponse.next()`

### 9.2 Authentication Patterns

**API Key Pattern:**

```typescript
export function middleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');

  if (!isValidApiKey(apiKey)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  return NextResponse.next();
}
```

**Bearer Token Pattern:**

```typescript
export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.next();
}
```

**Session Pattern:**

```typescript
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isValid = await validateSession(session.value);

  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### 9.3 Authorization Pattern

```typescript
// In resolver
/** @gqlMutationField */
export function createSiteDiary(
  input: SiteDiaryInput,
  context: { userId: string; role: string },
): SiteDiary {
  // Check authorization
  if (context.role !== 'admin' && context.role !== 'editor') {
    throw new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHORIZED' },
    });
  }

  // Proceed with creation
  const diary = { ...input, createdBy: context.userId };
  siteDiaries.push(diary);
  return diary;
}
```

---

## 10. Validation Patterns

### 10.1 Manual Validation

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Required field validation
  if (!body.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  // Type validation
  if (typeof body.title !== 'string') {
    return NextResponse.json(
      { error: 'Title must be a string' },
      { status: 400 },
    );
  }

  // Format validation
  if (!isValidDate(body.date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  // Range validation
  if (body.title.length > 200) {
    return NextResponse.json({ error: 'Title too long' }, { status: 400 });
  }

  // Proceed...
}
```

### 10.2 Zod Validation Pattern (Recommended)

```bash
yarn add zod
```

```typescript
import { z } from 'zod';

// Define schema
const SiteDiarySchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdBy: z.string().min(1),
  content: z.string().optional(),
  weather: z
    .object({
      temperature: z.number().int().min(-50).max(50),
      description: z.enum(['sunny', 'cloudy', 'rainy', 'snowy']),
    })
    .optional(),
});

// Use in route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate and parse
    const validatedData = SiteDiarySchema.parse(body);

    // Use validated data
    const diary = createDiary(validatedData);

    return NextResponse.json(diary, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Benefits:**

- Type inference
- Automatic validation
- Detailed error messages
- Reusable schemas

---

## 11. Database Integration (Future)

### 11.1 Prisma ORM Pattern (Recommended)

**Install:**

```bash
yarn add prisma @prisma/client
yarn prisma init
```

**Schema:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model SiteDiary {
  id          String   @id @default(cuid())
  date        DateTime
  title       String
  content     String?
  createdBy   String
  attendees   String[]
  attachments String[]
  weather     Weather?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Weather {
  id          String    @id @default(cuid())
  temperature Int
  description String
  diaryId     String    @unique
  diary       SiteDiary @relation(fields: [diaryId], references: [id])
}
```

**Client Setup:** `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Usage in Resolver:**

```typescript
import { prisma } from '@/lib/prisma';

/** @gqlQueryField */
export async function siteDiaries(): Promise<SiteDiary[]> {
  return await prisma.siteDiary.findMany({
    include: { weather: true },
  });
}

/** @gqlMutationField */
export async function createSiteDiary(
  input: SiteDiaryInput,
): Promise<SiteDiary> {
  return await prisma.siteDiary.create({
    data: input,
  });
}
```

---

## 12. API Design Best Practices

### 12.1 Naming Conventions

**GraphQL:**

- Types: `PascalCase` (SiteDiary, Weather)
- Fields: `camelCase` (createdBy, siteDiaries)
- Enums: `SCREAMING_SNAKE_CASE` (DRAFT, PUBLISHED)
- Mutations: verb + noun (createSiteDiary, updateSiteDiary)

**REST:**

- URLs: `kebab-case` (/api/site-diary)
- Query params: `camelCase` (?createdBy=John)
- JSON keys: `camelCase` ({ createdBy: "John" })

### 12.2 Response Format Conventions

**Success Response:**

```json
{
  "data": {
    /* ... */
  },
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "error": "Error description",
  "details": {
    /* additional context */
  },
  "code": "ERROR_CODE"
}
```

### 12.3 Pagination Pattern

```typescript
/** @gqlQueryField */
export function siteDiariesPaginated(
  limit: Int = 10,
  offset: Int = 0,
): PaginatedResponse {
  const items = siteDiaries.slice(offset, offset + limit);
  const total = siteDiaries.length;

  return {
    items,
    pagination: {
      limit,
      offset,
      total,
      hasMore: offset + limit < total,
    },
  };
}
```

### 12.4 Sorting Pattern

```typescript
type SortOrder = 'asc' | 'desc';

export function siteDiariesSorted(
  sortBy: keyof SiteDiary = 'date',
  order: SortOrder = 'desc',
): SiteDiary[] {
  return [...siteDiaries].sort((a, b) => {
    if (order === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });
}
```

---

## 13. Testing Backend Code

### 13.1 Unit Testing Resolvers

```typescript
// __tests__/resolvers/site-diary.test.ts
import { siteDiaries, siteDiary } from '@/app/api/graphql/query';

describe('Site Diary Resolvers', () => {
  test('siteDiaries returns all diaries', () => {
    const result = siteDiaries();
    expect(Array.isArray(result)).toBe(true);
  });

  test('siteDiary returns diary by id', () => {
    const result = siteDiary('cm4lvx1rf00006fujdr7w5u9h');
    expect(result).toBeDefined();
    expect(result?.id).toBe('cm4lvx1rf00006fujdr7w5u9h');
  });

  test('siteDiary returns undefined for invalid id', () => {
    const result = siteDiary('invalid-id');
    expect(result).toBeUndefined();
  });
});
```

### 13.2 Integration Testing API Routes

```typescript
// __tests__/api/site-diary.test.ts
import { GET, POST } from '@/app/api/site-diary/route';
import { NextRequest } from 'next/server';

describe('/api/site-diary', () => {
  test('GET returns all diaries', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST creates new diary', async () => {
    const request = new NextRequest('http://localhost:3000/api/site-diary', {
      method: 'POST',
      body: JSON.stringify({
        id: 'test-123',
        date: '2025-10-23',
        title: 'Test Diary',
        createdBy: 'Tester',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.siteDiary.title).toBe('Test Diary');
  });
});
```

---

## 14. Performance Considerations

### 14.1 Caching Strategies

**In-Memory Cache:**

```typescript
const cache = new Map<string, { data: any; expires: number }>();

export function getCachedDiaries(): SiteDiary[] {
  const cached = cache.get('diaries');

  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const data = siteDiaries;
  cache.set('diaries', {
    data,
    expires: Date.now() + 60000, // 1 minute
  });

  return data;
}
```

**Next.js Data Cache:**

```typescript
export async function GET() {
  const diaries = await fetch('http://localhost:3000/api/data', {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  return NextResponse.json(diaries);
}
```

### 14.2 Query Optimization

**Avoid N+1 Queries (when using DB):**

```typescript
// ❌ Bad: N+1 queries
const diaries = await prisma.siteDiary.findMany();
for (const diary of diaries) {
  diary.weather = await prisma.weather.findUnique({
    where: { diaryId: diary.id },
  });
}

// ✅ Good: Single query with includes
const diaries = await prisma.siteDiary.findMany({
  include: { weather: true },
});
```

### 14.3 Pagination for Large Datasets

```typescript
// Always paginate large datasets
export function siteDiariesPaginated(limit: number = 50, offset: number = 0) {
  return siteDiaries.slice(offset, offset + limit);
}
```

---

## 15. Backend Development Workflow

### 15.1 Adding New GraphQL Feature

**Step 1:** Define types in data layer

```typescript
// data/site-diary.ts
/** @gqlType */
export type Comment = {
  /** @gqlField */
  id: string;
  /** @gqlField */
  text: string;
  /** @gqlField */
  authorId: string;
};
```

**Step 2:** Add resolver

```typescript
// app/api/graphql/query.ts
/** @gqlQueryField */
export function comments(diaryId: string): Comment[] {
  return getCommentsByDiaryId(diaryId);
}
```

**Step 3:** Regenerate schema

```bash
yarn grats
```

**Step 4:** Test in GraphiQL

```graphql
query {
  comments(diaryId: "123") {
    id
    text
  }
}
```

### 15.2 Adding New REST Endpoint

**Step 1:** Create route file

```typescript
// app/api/comments/route.ts
export async function GET() {
  const comments = getAllComments();
  return NextResponse.json(comments);
}
```

**Step 2:** Test with curl or Postman

```bash
curl http://localhost:3000/api/comments
```

### 15.3 Debugging Tips

**Console Logging:**

```typescript
export function siteDiary(id: string): SiteDiary | undefined {
  console.log('Finding diary with id:', id);
  const result = siteDiaries.find((d) => d.id === id);
  console.log('Result:', result);
  return result;
}
```

**GraphQL Yoga Debug Mode:**

```typescript
const { handleRequest } = createYoga({
  schema: getSchema(),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  logging: 'debug', // Enable debug logging
});
```

---

## 16. Quick Reference Cheat Sheet

### Grats Annotations

```typescript
/** @gqlType */ // Object type
/** @gqlField */ // Field on type
/** @gqlQueryField */ // Root Query field
/** @gqlMutationField */ // Root Mutation field
/** @gqlInput */ // Input object type
```

### Next.js Route Handlers

```typescript
export async function GET(request: NextRequest) {}
export async function POST(request: NextRequest) {}
export async function PUT(request: NextRequest) {}
export async function DELETE(request: NextRequest) {}
```

### Common Patterns

```typescript
// Find by ID
siteDiaries.find((d) => d.id === id);

// Filter
siteDiaries.filter((d) => d.date === date);

// Create
siteDiaries.push(newDiary);

// Update
siteDiaries[index] = { ...siteDiaries[index], ...updates };

// Delete
siteDiaries.splice(index, 1);
```

### Response Helpers

```typescript
// Success
NextResponse.json(data, { status: 200 });

// Created
NextResponse.json(data, { status: 201 });

// Error
NextResponse.json({ error: 'message' }, { status: 400 });

// Not Found
NextResponse.json({ error: 'Not found' }, { status: 404 });
```

### Commands

```bash
# Regenerate GraphQL schema
yarn grats

# Start dev server
yarn dev:web

# Test GraphQL
# Open http://localhost:3000/api/graphql
```

---

## Conclusion

This guide covers all backend patterns used in the Site Diary project. Key takeaways:

1. **Next.js as Backend:** API routes provide the backend layer
2. **GraphQL with Grats:** Type-safe schema generation from TypeScript
3. **REST Alternative:** Traditional REST API alongside GraphQL
4. **In-Memory Storage:** Current implementation (migrate to database later)
5. **Type Safety:** TypeScript throughout the entire backend
6. **Middleware:** Authentication and request processing
7. **Error Handling:** Consistent error responses
8. **Testing:** Unit and integration tests for reliability

**Next Steps:**

- Implement missing CRUD operations
- Add input validation with Zod
- Migrate to database (Prisma + PostgreSQL)
- Add authentication/authorization
- Write comprehensive tests
- Add API documentation

**Related Guides:**

- `frontend-coding-patterns.md` - Frontend patterns
- `developer-onboarding.md` - Setup and getting started
- `api-endpoints-reference.md` - API documentation

---

**Last Updated:** October 23, 2025  
**Maintained By:** Development Team  
**Questions?** Update this doc or create an issue!
