# Developer Onboarding Guide - Site Diary Application

**Last Updated:** October 22, 2025  
**Status:** Active Development  
**Project:** Untitled Workspace - Site Diary Management System

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Environment Configuration](#environment-configuration)
6. [Available Endpoints & API Reference](#available-endpoints--api-reference)
7. [Current Issues & Known Bugs](#current-issues--known-bugs)
8. [Development Workflow](#development-workflow)
9. [Testing](#testing)
10. [Next Steps & TODO](#next-steps--todo)

---

## 1. Project Overview

### What is this application?

This is a **Site Diary Management System** designed for construction or project management use cases. It allows users to:

- Create, read, update, and delete site diary entries
- Track daily activities with detailed information including:
  - Date and title
  - Weather conditions (temperature, description)
  - Content/description of activities
  - List of attendees
  - Photo attachments (URLs)
  - Creator information

### Application Components

This is a **monorepo** with the following apps:

1. **Web App** (`apps/web`) - Next.js 15 application with GraphQL API
2. **Mobile App** (`apps/mobile`) - React Native Expo application
3. **Shared Packages** (`packages/*`) - ESLint configuration

---

## 2. Architecture & Technology Stack

### Web Application Stack

**Framework & Core:**

- **Next.js 15.5.6** with App Router (using Turbopack)
- **React 19.1.0**
- **TypeScript 5.9.3**

**GraphQL Implementation:**

- **GraphQL Yoga 5.16.0** - GraphQL server
- **Grats 0.0.34** - GraphQL schema generation from TypeScript comments
- **@apollo/client 4.0.7** - Client-side GraphQL
- **@apollo/client-integration-nextjs 0.14.0** - Next.js integration
- **@graphql-codegen** - Type generation from schema

**Styling:**

- **Tailwind CSS 4.1.15**
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - UI component system

### Mobile Application Stack

**Framework & Core:**

- **Expo 54.0.13** with Dev Client
- **React Native 0.81.4**
- **Expo Router 6.0.12** - File-based routing

**Styling:**

- **NativeWind 5.0.0** - Tailwind CSS for React Native

**GraphQL:**

- **@apollo/client 4.0.7**

### Data Storage

**Current Implementation:**

- **In-memory storage** using a TypeScript array (`apps/web/src/data/site-diary.ts`)
- ⚠️ **Important:** Data does NOT persist across server restarts
- ⚠️ **Important:** Create/Update/Delete operations currently DON'T save data (see Known Bugs)

### Package Manager

- **Yarn 1.22.22** (Classic)
- Configured as a monorepo using Yarn Workspaces

---

## 3. Getting Started

### Prerequisites

- **Node.js** (version compatible with React 19 - recommend v20+)
- **Yarn 1.22.22**
- **macOS** (for iOS development)
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd coding-test

# Install all dependencies (installs for root, apps, and packages)
yarn install

# This will also run:
# - yarn-deduplicate (clean up duplicate packages)
# - patch-package (apply any package patches)
```

### Running the Applications

#### Web Application

```bash
# From root directory
yarn dev:web

# Or from web app directory
cd apps/web
yarn dev
```

**Access at:** `http://localhost:3000`

#### Mobile Application

```bash
# From root directory
yarn dev:mobile

# Or from mobile app directory
cd apps/mobile
yarn dev
```

This will open Expo Dev Tools. You can then:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

### Building

```bash
# Web production build
cd apps/web
yarn build

# Mobile builds
cd apps/mobile
yarn ios        # Run iOS build
yarn android    # Run Android build
yarn prebuild   # Generate native projects
```

---

## 4. Project Structure

```
coding-test/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── api/              # API Routes
│   │   │   │   │   ├── graphql/      # GraphQL endpoint
│   │   │   │   │   │   ├── route.ts  # GraphQL Yoga handler
│   │   │   │   │   │   ├── schema.ts # Schema exports
│   │   │   │   │   │   ├── schema.graphql  # Generated schema
│   │   │   │   │   │   ├── query.ts  # Query resolvers
│   │   │   │   │   │   └── mutation.ts  # Mutation resolvers
│   │   │   │   │   └── site-diary/   # REST endpoints
│   │   │   │   │       ├── route.ts  # GET all, POST create
│   │   │   │   │       └── [id]/route.ts  # GET by ID
│   │   │   │   ├── layout.tsx        # Root layout
│   │   │   │   └── page.tsx          # Home page
│   │   │   ├── components/
│   │   │   │   ├── apollo-wrapper.tsx  # Apollo Provider
│   │   │   │   ├── client-child.tsx    # Example component
│   │   │   │   └── ui/               # UI components (shadcn)
│   │   │   ├── data/
│   │   │   │   └── site-diary.ts     # In-memory data store
│   │   │   ├── graphql/
│   │   │   │   └── queries.ts        # GraphQL query definitions
│   │   │   ├── lib/
│   │   │   │   ├── apollo-client.ts  # Server-side Apollo client
│   │   │   │   └── utils.ts          # Utility functions
│   │   │   └── types/
│   │   │       └── __generated__/
│   │   │           └── graphql.ts    # Generated TypeScript types
│   │   ├── .env                      # Environment variables (port 3000)
│   │   ├── .env.local                # Local overrides (port 3000)
│   │   ├── codegen.ts                # GraphQL Code Generator config
│   │   ├── next.config.ts            # Next.js configuration
│   │   └── package.json
│   │
│   └── mobile/                       # React Native Expo app
│       ├── src/
│       │   ├── app/                  # Expo Router file-based routing
│       │   │   ├── (tabs)/           # Tab navigation
│       │   │   │   └── (home)/
│       │   │   │       └── index.tsx # Home screen
│       │   │   ├── _layout.tsx       # Root layout
│       │   │   └── +html.tsx         # HTML wrapper
│       │   ├── components/
│       │   │   └── ui/               # UI components
│       │   └── types/
│       │       └── __generated__/
│       │           └── graphql.ts    # Generated types
│       ├── app.config.js             # Expo configuration
│       ├── codegen.ts                # GraphQL Code Generator config
│       └── package.json
│
├── packages/
│   └── eslint-config/                # Shared ESLint configuration
│
├── docs/
│   ├── design/                       # Design documents
│   │   ├── site-diary-implementation-analysis.md
│   │   └── site-diary-implementation-fixes.md
│   └── guides/                       # Developer guides (this file)
│       └── developer-onboarding.md
│
├── package.json                      # Root package.json (workspace config)
├── turbo.json                        # Turborepo configuration
└── yarn.lock                         # Yarn lockfile
```

---

## 5. Environment Configuration

### Web Application Environment Variables

**Location:** `apps/web/.env.local` (primary) and `apps/web/.env`

```env
# API Configuration
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3000/api/graphql

# Other keys
API_KEY=something-cool
```

**Important Notes:**

- `.env.local` takes precedence over `.env`
- Both files currently point to port **3000** (correct)
- The GraphQL API is served by the Next.js server itself (not a separate server)
- Must restart the dev server after changing environment variables

**Fallback Values:**
The Apollo Client configs have fallback URLs hardcoded:

- `apps/web/src/lib/apollo-client.ts` - defaults to `http://localhost:3000/api/graphql`
- `apps/web/src/components/apollo-wrapper.tsx` - defaults to `http://localhost:3000/api/graphql`

### Mobile Application Environment Variables

The mobile app connects to the web app's GraphQL API. Configuration is typically done through Expo's environment system or directly in the Apollo client setup.

---

## 6. Available Endpoints & API Reference

### Base URL

- **Local Development:** `http://localhost:3000`
- **GraphQL Endpoint:** `http://localhost:3000/api/graphql`

---

### 🔵 GraphQL Endpoints

All GraphQL requests use the same endpoint with different queries/mutations.

**Base Endpoint:** `POST http://localhost:3000/api/graphql`  
**Headers:** `Content-Type: application/json`

#### 6.1 Query: Get All Site Diaries

**Status:** ✅ **WORKING**

**Query:**

```graphql
query SiteDiaries {
  siteDiaries {
    id
    title
    date
    createdBy
    content
    weather {
      temperature
      description
    }
    attendees
    attachments
  }
}
```

**Request Body:**

```json
{
  "query": "query SiteDiaries { siteDiaries { id title date createdBy content weather { temperature description } attendees attachments } }"
}
```

**Sample Response:**

```json
{
  "data": {
    "siteDiaries": [
      {
        "id": "cm4lvx1rf00006fujdr7w5u9h",
        "title": "Test",
        "date": "2024-12-13",
        "createdBy": "John Doe",
        "content": "Site diary entry to discuss the activities of the day",
        "weather": {
          "temperature": 20,
          "description": "sunny"
        },
        "attendees": ["Jane Smith", "John Doe"],
        "attachments": [
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      },
      {
        "id": "cm4lvx1rf00007fujdr7w5u9i",
        "title": "Progress Meeting",
        "date": "2024-12-12",
        "createdBy": "Jane Smith",
        "content": "Detailed discussion on project milestones",
        "weather": {
          "temperature": 18,
          "description": "cloudy"
        },
        "attendees": ["John Doe", "Mary Johnson"],
        "attachments": [
          "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      },
      {
        "id": "cm4lvx1rf00008fujdr7w5u9j",
        "title": "Inspection Report",
        "date": "2024-12-11",
        "createdBy": "Mary Johnson",
        "content": "Inspection of the northern site completed",
        "weather": {
          "temperature": 22,
          "description": "partly cloudy"
        },
        "attendees": ["Jane Smith", "Robert Brown"],
        "attachments": [
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      },
      {
        "id": "cm4lvx1rf00009fujdr7w5u9k",
        "title": "Safety Check",
        "date": "2024-12-10",
        "createdBy": "Robert Brown",
        "content": "Conducted safety checks on all equipment",
        "weather": {
          "temperature": 16,
          "description": "rainy"
        },
        "attendees": ["John Doe", "Mary Johnson"],
        "attachments": []
      },
      {
        "id": "cm4lvx1rf00010fujdr7w5u9l",
        "title": "Weekly Summary",
        "date": "2024-12-09",
        "createdBy": "Jane Smith",
        "content": "Summarised the weekly progress on the project",
        "weather": {
          "temperature": 19,
          "description": "windy"
        },
        "attendees": ["Jane Smith", "Robert Brown", "Mary Johnson"],
        "attachments": [
          "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      }
    ]
  }
}
```

---

#### 6.2 Query: Get Single Site Diary

**Status:** ✅ **WORKING**

**Query:**

```graphql
query SiteDiary($id: String!) {
  siteDiary(id: $id) {
    id
    title
    date
    createdBy
    content
    weather {
      temperature
      description
    }
    attendees
    attachments
  }
}
```

**Request Body:**

```json
{
  "query": "query SiteDiary($id: String!) { siteDiary(id: $id) { id title date createdBy content weather { temperature description } attendees attachments } }",
  "variables": {
    "id": "cm4lvx1rf00006fujdr7w5u9h"
  }
}
```

**Sample Response (Success):**

```json
{
  "data": {
    "siteDiary": {
      "id": "cm4lvx1rf00006fujdr7w5u9h",
      "title": "Test",
      "date": "2024-12-13",
      "createdBy": "John Doe",
      "content": "Site diary entry to discuss the activities of the day",
      "weather": {
        "temperature": 20,
        "description": "sunny"
      },
      "attendees": ["Jane Smith", "John Doe"],
      "attachments": [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    }
  }
}
```

**Sample Response (Not Found):**

```json
{
  "data": {
    "siteDiary": null
  }
}
```

**Valid IDs from Current Dataset:**

- `cm4lvx1rf00006fujdr7w5u9h` (John Doe - Test)
- `cm4lvx1rf00007fujdr7w5u9i` (Jane Smith - Progress Meeting)
- `cm4lvx1rf00008fujdr7w5u9j` (Mary Johnson - Inspection Report)
- `cm4lvx1rf00009fujdr7w5u9k` (Robert Brown - Safety Check)
- `cm4lvx1rf00010fujdr7w5u9l` (Jane Smith - Weekly Summary)

---

#### 6.3 Mutation: Create Site Diary

**Status:** ⚠️ **PARTIALLY WORKING** (Returns data but doesn't persist)

**⚠️ CRITICAL BUG:** This mutation returns the created diary entry but **DOES NOT** save it to the data store. If you query `siteDiaries` after creating, the new entry will NOT appear.

**Mutation:**

```graphql
mutation CreateSiteDiary($input: SiteDiaryInput!) {
  createSiteDiary(input: $input) {
    id
    title
    date
    createdBy
    content
    weather {
      temperature
      description
    }
    attendees
    attachments
  }
}
```

**Request Body (Minimal):**

```json
{
  "query": "mutation CreateSiteDiary($input: SiteDiaryInput!) { createSiteDiary(input: $input) { id title date createdBy } }",
  "variables": {
    "input": {
      "id": "test-new-123",
      "date": "2025-10-22",
      "title": "New Test Entry",
      "createdBy": "Postman User"
    }
  }
}
```

**Request Body (Full with Optional Fields):**

```json
{
  "query": "mutation CreateSiteDiary($input: SiteDiaryInput!) { createSiteDiary(input: $input) { id title date createdBy content weather { temperature description } attendees attachments } }",
  "variables": {
    "input": {
      "id": "test-full-456",
      "date": "2025-10-22",
      "title": "Complete Test Entry",
      "createdBy": "Developer"
    }
  }
}
```

**Current Schema Definition:**

```graphql
input SiteDiaryInput {
  createdBy: String!
  date: String!
  id: String!
  title: String!
}
```

**⚠️ Note:** The current schema only accepts `id`, `date`, `title`, and `createdBy`. Optional fields like `content`, `weather`, `attendees`, and `attachments` are NOT available in the mutation input (another bug).

**Sample Response:**

```json
{
  "data": {
    "createSiteDiary": {
      "id": "test-new-123",
      "title": "New Test Entry",
      "date": "2025-10-22",
      "createdBy": "Postman User"
    }
  }
}
```

---

#### 6.4 Mutation: Update Site Diary

**Status:** ❌ **NOT IMPLEMENTED**

This mutation is not currently available. Need to implement in `apps/web/src/app/api/graphql/mutation.ts`.

**Expected Query (when implemented):**

```graphql
mutation UpdateSiteDiary($id: String!, $input: SiteDiaryInput!) {
  updateSiteDiary(id: $id, input: $input) {
    id
    title
    date
    createdBy
    content
    weather {
      temperature
      description
    }
    attendees
    attachments
  }
}
```

---

#### 6.5 Mutation: Delete Site Diary

**Status:** ❌ **NOT IMPLEMENTED**

This mutation is not currently available. Need to implement in `apps/web/src/app/api/graphql/mutation.ts`.

**Expected Query (when implemented):**

```graphql
mutation DeleteSiteDiary($id: String!) {
  deleteSiteDiary(id: $id)
}
```

---

### 🟢 REST Endpoints

#### 6.6 REST: Get All Site Diaries (Summary)

**Status:** ✅ **WORKING**

**Method:** `GET`  
**URL:** `http://localhost:3000/api/site-diary`  
**Headers:** None required

**Description:** Returns a simplified list of site diaries with only key fields (id, date, title, createdBy).

**Sample Response:**

```json
[
  {
    "id": "cm4lvx1rf00006fujdr7w5u9h",
    "date": "2024-12-13",
    "title": "Test",
    "createdBy": "John Doe"
  },
  {
    "id": "cm4lvx1rf00007fujdr7w5u9i",
    "date": "2024-12-12",
    "title": "Progress Meeting",
    "createdBy": "Jane Smith"
  },
  {
    "id": "cm4lvx1rf00008fujdr7w5u9j",
    "date": "2024-12-11",
    "title": "Inspection Report",
    "createdBy": "Mary Johnson"
  },
  {
    "id": "cm4lvx1rf00009fujdr7w5u9k",
    "date": "2024-12-10",
    "title": "Safety Check",
    "createdBy": "Robert Brown"
  },
  {
    "id": "cm4lvx1rf00010fujdr7w5u9l",
    "date": "2024-12-09",
    "title": "Weekly Summary",
    "createdBy": "Jane Smith"
  }
]
```

---

#### 6.7 REST: Get Single Site Diary by ID

**Status:** ✅ **WORKING**

**Method:** `GET`  
**URL:** `http://localhost:3000/api/site-diary/{id}`  
**Headers:** None required

**Example URL:** `http://localhost:3000/api/site-diary/cm4lvx1rf00006fujdr7w5u9h`

**Sample Response (Success - 200):**

```json
{
  "id": "cm4lvx1rf00006fujdr7w5u9h",
  "date": "2024-12-13",
  "weather": {
    "temperature": 20,
    "description": "sunny"
  },
  "createdBy": "John Doe",
  "title": "Test",
  "content": "Site diary entry to discuss the activities of the day",
  "attendees": ["Jane Smith", "John Doe"],
  "attachments": [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

**Sample Response (Not Found - 404):**

```json
{
  "error": "Entry not found"
}
```

---

#### 6.8 REST: Create Site Diary

**Status:** ⚠️ **PARTIALLY WORKING** (Validates but doesn't persist)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/site-diary`  
**Headers:** `Content-Type: application/json`

**⚠️ CRITICAL BUG:** This endpoint validates the input and returns a success message, but **DOES NOT** save the entry to the data store.

**Request Body (Minimal - Required Fields Only):**

```json
{
  "id": "test-rest-123",
  "date": "2025-10-22",
  "title": "REST Test Entry",
  "createdBy": "API Tester"
}
```

**Request Body (Complete - All Fields):**

```json
{
  "id": "test-rest-456",
  "date": "2025-10-22",
  "title": "Complete REST Entry",
  "createdBy": "Developer",
  "content": "This is a detailed description of the site activities for the day. We completed the foundation work and started on the framing.",
  "weather": {
    "temperature": 25,
    "description": "sunny"
  },
  "attendees": ["John Doe", "Jane Smith", "Bob Builder"],
  "attachments": [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974"
  ]
}
```

**Sample Response (Success - 201):**

```json
{
  "message": "Site diary created successfully",
  "siteDiary": {
    "id": "test-rest-123",
    "date": "2025-10-22",
    "title": "REST Test Entry",
    "createdBy": "API Tester",
    "content": "This is a test",
    "weather": {
      "temperature": 25,
      "description": "sunny"
    },
    "attendees": ["John Doe"],
    "attachments": []
  }
}
```

**Sample Response (Validation Error - 400):**

```json
{
  "error": "Validation failed",
  "details": "date, createdBy and title are required"
}
```

**Required Fields:**

- `date` (String, format: YYYY-MM-DD)
- `createdBy` (String)
- `title` (String)

**Optional Fields:**

- `id` (String) - Note: Current implementation expects this but should be auto-generated
- `content` (String)
- `weather` (Object with `temperature` (Number) and `description` (String))
- `attendees` (Array of Strings)
- `attachments` (Array of Strings - URLs)

---

#### 6.9 REST: Update Site Diary

**Status:** ❌ **NOT IMPLEMENTED**

**Expected Implementation:**  
**Method:** `PUT`  
**URL:** `http://localhost:3000/api/site-diary?id={id}`  
**Headers:** `Content-Type: application/json`

Not currently available. Need to add PUT handler to `apps/web/src/app/api/site-diary/route.ts`.

---

#### 6.10 REST: Delete Site Diary

**Status:** ❌ **NOT IMPLEMENTED**

**Expected Implementation:**  
**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/site-diary?id={id}`

Not currently available. Need to add DELETE handler to `apps/web/src/app/api/site-diary/route.ts`.

---

### GraphQL Schema Reference

**Location:** `apps/web/src/app/api/graphql/schema.graphql` (auto-generated by Grats)

```graphql
# Schema generated by Grats (https://grats.capt.dev)
# Do not manually edit. Regenerate by running `npx grats`.

input SiteDiaryInput {
  createdBy: String!
  date: String!
  id: String!
  title: String!
}

type Mutation {
  createSiteDiary(input: SiteDiaryInput!): SiteDiary!
}

type Query {
  siteDiaries: [SiteDiary!]!
  siteDiary(id: String!): SiteDiary
}

type SiteDiary {
  attachments: [String!]
  attendees: [String!]
  content: String
  createdBy: String!
  date: String!
  id: String!
  title: String!
  weather: Weather
}

type Weather {
  description: String!
  temperature: Int!
}
```

**Important:** The schema is generated from TypeScript using Grats annotations (`@gqlType`, `@gqlField`, `@gqlQueryField`, `@gqlMutationField`, `@gqlInput`).

---

## 7. Current Issues & Known Bugs

### 🔴 Critical Issues (Must Fix)

#### 7.1 GraphQL Create Mutation Doesn't Persist Data

**File:** `apps/web/src/app/api/graphql/mutation.ts`

**Current Code:**

```typescript
/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  return input; // BUG: Just returns input, doesn't save!
}
```

**Problem:** The mutation just returns the input without adding it to the `siteDiaries` array.

**Fix Required:**

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  const newDiary: SiteDiary = {
    id: input.id,
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: undefined,
    weather: undefined,
    attendees: undefined,
    attachments: undefined,
  };

  siteDiaries.push(newDiary); // Actually save it!
  return newDiary;
}
```

---

#### 7.2 REST Create Endpoint Doesn't Persist Data

**File:** `apps/web/src/app/api/site-diary/route.ts`

**Current Code:**

```typescript
export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Validation...

    return NextResponse.json(
      { message: 'Site diary created successfully', siteDiary },
      { status: 201 },
    ); // BUG: Returns success but doesn't save!
  } catch (e: unknown) {
    // Error handling...
  }
}
```

**Problem:** Validates and returns success but never adds to `siteDiaries` array.

**Fix Required:**

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';

export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Validation...
    if (!siteDiary.date || !siteDiary.createdBy || !siteDiary.title) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: 'date, createdBy and title are required',
        },
        { status: 400 },
      );
    }

    // Actually save the diary
    siteDiaries.push(siteDiary);

    return NextResponse.json(
      { message: 'Site diary created successfully', siteDiary },
      { status: 201 },
    );
  } catch (e: unknown) {
    // Error handling...
  }
}
```

---

#### 7.3 GraphQL Mutation Input Type Missing Optional Fields

**File:** `apps/web/src/app/api/graphql/mutation.ts`

**Current Schema:**

```typescript
/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
}
```

**Problem:** The `SiteDiary` type has optional fields (`content`, `weather`, `attendees`, `attachments`) but `SiteDiaryInput` doesn't support them.

**Fix Required:**

```typescript
/** @gqlInput */
interface WeatherInput {
  temperature: number;
  description: string;
}

/** @gqlInput */
interface SiteDiaryInput {
  id?: string; // Make optional, should be auto-generated
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}
```

Then regenerate schema: `yarn grats && yarn codegen`

---

### 🟡 Missing Features (Should Implement)

#### 7.4 Missing UPDATE Operations

**Required Changes:**

1. **GraphQL Update Mutation** - Add to `apps/web/src/app/api/graphql/mutation.ts`:

```typescript
/** @gqlMutationField */
export function updateSiteDiary(
  id: string,
  input: Partial<SiteDiaryInput>,
): SiteDiary | null {
  const index = siteDiaries.findIndex((diary) => diary.id === id);
  if (index === -1) return null;

  const updated = { ...siteDiaries[index], ...input };
  siteDiaries[index] = updated;
  return updated;
}
```

2. **REST Update Endpoint** - Add PUT handler to `apps/web/src/app/api/site-diary/route.ts`:

```typescript
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const updates = await request.json();
    const index = siteDiaries.findIndex((diary) => diary.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    siteDiaries[index] = { ...siteDiaries[index], ...updates };

    return NextResponse.json({
      message: 'Updated successfully',
      siteDiary: siteDiaries[index],
    });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
```

---

#### 7.5 Missing DELETE Operations

**Required Changes:**

1. **GraphQL Delete Mutation** - Add to `apps/web/src/app/api/graphql/mutation.ts`:

```typescript
/** @gqlMutationField */
export function deleteSiteDiary(id: string): boolean {
  const index = siteDiaries.findIndex((diary) => diary.id === id);
  if (index === -1) return false;

  siteDiaries.splice(index, 1);
  return true;
}
```

2. **REST Delete Endpoint** - Add DELETE handler to `apps/web/src/app/api/site-diary/route.ts`:

```typescript
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const index = siteDiaries.findIndex((diary) => diary.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    siteDiaries.splice(index, 1);

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
```

---

#### 7.6 ID Generation

**Issue:** Currently, IDs must be provided by the client. Should be auto-generated by the server.

**Recommended Fix:** Use `nanoid` for ID generation.

```bash
# Install dependency
cd apps/web
yarn add nanoid
```

```typescript
import { nanoid } from 'nanoid';

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  const newDiary: SiteDiary = {
    id: input.id || nanoid(), // Auto-generate if not provided
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather,
    attendees: input.attendees,
    attachments: input.attachments,
  };

  siteDiaries.push(newDiary);
  return newDiary;
}
```

---

### 🟢 Minor Issues

#### 7.7 No Input Validation

**Issue:** No validation for date format, URL format for attachments, temperature ranges, etc.

**Recommended:** Implement validation using `zod` or similar library.

#### 7.8 No Error Handling for Invalid Weather Descriptions

**Issue:** Any string is accepted for `weather.description` but should be an enum.

**Fix:** Update the Grats schema to use specific weather types.

#### 7.9 No Pagination

**Issue:** The `siteDiaries` query returns all entries. Will be problematic with large datasets.

**Recommended:** Implement pagination with `limit` and `offset` parameters.

---

## 8. Development Workflow

### 8.1 Making Code Changes

#### When editing GraphQL resolvers (query.ts or mutation.ts):

1. Make changes to TypeScript files
2. Regenerate GraphQL schema: `yarn grats` (from `apps/web`)
3. Regenerate TypeScript types: `yarn codegen` (from `apps/web`)
4. Server auto-reloads (if using `yarn dev`)

**Shortcut from root:**

```bash
cd apps/web && yarn grats && yarn codegen
```

#### When editing components or pages:

- Changes hot-reload automatically with Turbopack
- No manual steps needed

#### When adding new dependencies:

```bash
# For web app
cd apps/web
yarn add <package-name>

# For mobile app
cd apps/mobile
yarn add <package-name>

# For dev dependencies
yarn add -D <package-name>
```

---

### 8.2 Code Quality Commands

```bash
# Lint all code
yarn lint

# Type check all code
yarn typecheck

# Format code
yarn format

# Check formatting without modifying
yarn format-check

# Run all CI checks (format, lint, typecheck)
yarn ci
```

---

### 8.3 GraphQL Development Tools

#### GraphiQL Playground

GraphQL Yoga includes a built-in GraphiQL interface:

1. Start the dev server: `yarn dev:web`
2. Navigate to: `http://localhost:3000/api/graphql`
3. Use the interactive playground to test queries

**Note:** The playground may show the "event stream error" initially but still works for testing queries.

#### VS Code Extensions (Recommended)

- **GraphQL: Language Feature Support** - Syntax highlighting and IntelliSense
- **GraphQL: Inline Operation Execution** - Run queries from VS Code
- **Apollo GraphQL** - Enhanced GraphQL development

---

## 9. Testing

### 9.1 Current Testing Setup

**Status:** ⚠️ **No tests currently implemented**

### 9.2 Recommended Testing Approach

#### Unit Tests for Resolvers

Create `apps/web/src/__tests__/resolvers.test.ts`:

```typescript
import { createSiteDiary } from '@/app/api/graphql/mutation';
import {
  siteDiaries as getAllDiaries,
  siteDiary,
} from '@/app/api/graphql/query';
import { siteDiaries } from '@/data/site-diary';

describe('Site Diary Resolvers', () => {
  beforeEach(() => {
    // Reset data before each test
    siteDiaries.length = 0;
  });

  test('getAllDiaries returns all entries', () => {
    const result = getAllDiaries();
    expect(result).toEqual([]);
  });

  test('siteDiary returns entry by ID', () => {
    // Add test entry
    siteDiaries.push({
      id: 'test-1',
      date: '2025-10-22',
      title: 'Test',
      createdBy: 'Tester',
    });

    const result = siteDiary('test-1');
    expect(result?.title).toBe('Test');
  });
});
```

#### Integration Tests for API Endpoints

Create `apps/web/src/__tests__/api/site-diary.test.ts`:

```typescript
import { GET, POST } from '@/app/api/site-diary/route';
import { NextRequest } from 'next/server';

describe('Site Diary REST API', () => {
  test('GET returns all diaries', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
  });

  test('POST creates new diary', async () => {
    const request = new NextRequest('http://localhost:3000/api/site-diary', {
      method: 'POST',
      body: JSON.stringify({
        id: 'test-123',
        date: '2025-10-22',
        title: 'Test Entry',
        createdBy: 'Tester',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('Site diary created successfully');
  });
});
```

---

## 10. Next Steps & TODO

### Immediate Priorities (Do First)

- [ ] **Fix CREATE persistence bugs** (both GraphQL and REST)
  - Update `apps/web/src/app/api/graphql/mutation.ts` to actually save data
  - Update `apps/web/src/app/api/site-diary/route.ts` to actually save data

- [ ] **Expand GraphQL mutation input** to include optional fields
  - Add `content`, `weather`, `attendees`, `attachments` to `SiteDiaryInput`
  - Make `id` optional (auto-generate server-side)
  - Regenerate schema

- [ ] **Test the fixes** manually with Postman
  - Verify CREATE operations persist data
  - Verify subsequent GET requests return the new data

### Short-term Enhancements

- [ ] **Implement UPDATE operations**
  - GraphQL `updateSiteDiary` mutation
  - REST PUT endpoint
  - Update frontend to use update operations

- [ ] **Implement DELETE operations**
  - GraphQL `deleteSiteDiary` mutation
  - REST DELETE endpoint
  - Add confirmation dialogs in frontend

- [ ] **Add ID auto-generation**
  - Install `nanoid` package
  - Generate IDs server-side
  - Make `id` optional in input types

- [ ] **Implement proper validation**
  - Install `zod` for schema validation
  - Validate date formats (YYYY-MM-DD)
  - Validate URL formats for attachments
  - Validate temperature ranges
  - Create enum for weather descriptions

### Medium-term Improvements

- [ ] **Add filtering and pagination**
  - Query parameters for filtering by date range, creator, etc.
  - Pagination with `limit` and `offset`
  - Sort options (by date, title, etc.)

- [ ] **Implement real data persistence**
  - Set up database (PostgreSQL recommended)
  - Install Prisma ORM
  - Create database schema
  - Migrate existing code to use database

- [ ] **Enhanced error handling**
  - Custom error types
  - Detailed error messages
  - Error logging

- [ ] **Add authentication**
  - User authentication system
  - Authorization (who can create/edit/delete)
  - Track who made changes

### Long-term Features

- [ ] **File upload functionality**
  - Implement actual file upload (not just URLs)
  - Image compression and optimization
  - Storage solution (S3, Cloudinary, etc.)

- [ ] **Real-time updates**
  - WebSocket/GraphQL Subscriptions
  - Live updates when entries are created/modified

- [ ] **Mobile app features**
  - Camera integration for photos
  - Offline support with sync
  - Push notifications

- [ ] **Reporting and analytics**
  - Export to PDF
  - Weekly/monthly summaries
  - Analytics dashboard

- [ ] **Testing**
  - Unit tests for all resolvers
  - Integration tests for API endpoints
  - E2E tests with Playwright
  - Set up CI/CD pipeline

---

## Quick Reference Commands

```bash
# Development
yarn dev:web                    # Start web app (http://localhost:3000)
yarn dev:mobile                 # Start mobile app

# Code Generation
cd apps/web
yarn grats                      # Regenerate GraphQL schema from TypeScript
yarn codegen                    # Generate TypeScript types from GraphQL schema

# Code Quality
yarn lint                       # Lint all code
yarn typecheck                  # Type check all code
yarn format                     # Format all code
yarn ci                         # Run all CI checks

# Building
cd apps/web && yarn build       # Build web app for production
cd apps/mobile && yarn ios      # Build iOS app
cd apps/mobile && yarn android  # Build Android app

# Cleaning
yarn clean                      # Remove all node_modules
```

---

## Important Files Quick Reference

| Purpose                    | File Location                                   |
| -------------------------- | ----------------------------------------------- |
| GraphQL Schema             | `apps/web/src/app/api/graphql/schema.graphql`   |
| Query Resolvers            | `apps/web/src/app/api/graphql/query.ts`         |
| Mutation Resolvers         | `apps/web/src/app/api/graphql/mutation.ts`      |
| GraphQL Route Handler      | `apps/web/src/app/api/graphql/route.ts`         |
| REST API Endpoints         | `apps/web/src/app/api/site-diary/route.ts`      |
| REST API Single Entry      | `apps/web/src/app/api/site-diary/[id]/route.ts` |
| Data Store                 | `apps/web/src/data/site-diary.ts`               |
| Apollo Client (Server)     | `apps/web/src/lib/apollo-client.ts`             |
| Apollo Provider (Client)   | `apps/web/src/components/apollo-wrapper.tsx`    |
| GraphQL Queries (Frontend) | `apps/web/src/graphql/queries.ts`               |
| Environment Variables      | `apps/web/.env.local`                           |
| Type Definitions           | `apps/web/src/types/__generated__/graphql.ts`   |

---

## Contact & Support

**Documentation Issues:** If you find errors or have questions about this guide, please update this document or create an issue.

**Last Updated:** October 22, 2025  
**Next Review:** When implementing database persistence or major architecture changes

---

**🎯 Summary for New Developers:**

1. Clone repo and run `yarn install`
2. Start web app with `yarn dev:web`
3. Test endpoints with Postman (see section 6)
4. **Known Issue:** CREATE operations don't persist (see section 7.1 & 7.2)
5. **First Task:** Fix the persistence bugs before adding new features
6. Read the design docs in `docs/design/` for more context
7. Use the sample data payloads in section 6 for testing

Good luck! 🚀
