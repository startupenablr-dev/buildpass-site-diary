# Web App - GraphQL API Server

This is a [Next.js](https://nextjs.org) 15 project that also serves as the GraphQL API backend for the monorepo.

## Technologies

- Next.js 15 with App Router and Turbopack
- [Grats](https://grats.capt.dev) for code-first GraphQL schema generation
- GraphQL Yoga for the GraphQL server
- Apollo Client for GraphQL data fetching on the frontend
- [shadcn/ui](https://ui.shadcn.com) for UI components
- TypeScript

## Environment Variables

Create a `.env.local` file in this directory:

```sh
API_KEY=something-cool
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3000/api/graphql
```

## Getting Started

Run the development server from the monorepo root:

```bash
yarn dev:web
```

Or from this directory:

```bash
yarn dev
```

The GraphQL API will be available at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

## Project Structure

```
src/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── graphql/              # GraphQL API endpoint
│   │   │   ├── mutation.ts       # GraphQL mutation resolvers (Grats)
│   │   │   ├── query.ts          # GraphQL query resolvers (Grats)
│   │   │   ├── route.ts          # GraphQL Yoga server endpoint
│   │   │   ├── schema.ts         # Auto-generated schema (by Grats)
│   │   │   └── schema.graphql    # GraphQL SDL schema file
│   │   └── site-diary/           # REST API endpoints
│   │       ├── route.ts          # List/Create operations
│   │       └── [id]/route.ts     # Get/Update/Delete operations
│   ├── layout.tsx                # Root layout with Apollo Provider
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles and Tailwind directives
│   └── favicon.ico               # Site favicon
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   └── button.tsx            # Button component
│   ├── apollo-wrapper.tsx        # Apollo Client provider wrapper
│   └── client-child.tsx          # Example client component
├── data/                         # Data layer
│   └── site-diary.ts             # Site diary data and types
├── graphql/                      # GraphQL client queries/mutations
│   └── queries.ts                # Apollo Client query definitions
├── lib/                          # Utility libraries
│   ├── apollo-client.ts          # Apollo Client configuration
│   └── utils.ts                  # Utility functions (cn helper, etc.)
├── types/                        # TypeScript types
│   └── __generated__/            # Auto-generated types
│       └── graphql.ts            # Generated from GraphQL schema (codegen)
└── middleware.ts                 # Next.js middleware

codegen.ts                        # GraphQL Code Generator config
components.json                   # shadcn/ui configuration
```

### Key Directories

- **`app/api/graphql/`** - GraphQL server implementation using Grats for schema-first development
- **`app/api/site-diary/`** - REST API endpoints for site diary operations
- **`components/ui/`** - Reusable UI components from shadcn/ui
- **`data/`** - Application data layer and type definitions
- **`graphql/`** - Client-side GraphQL queries and mutations for Apollo Client
- **`lib/`** - Shared utilities and configurations
- **`types/__generated__/`** - Auto-generated TypeScript types from GraphQL schema

## GraphQL Schema

This project uses Grats for code-first GraphQL schema generation. The schema is defined using JSDoc decorators in:

- `src/app/api/graphql/query.ts` - Query resolvers
- `src/app/api/graphql/mutation.ts` - Mutation resolvers

After modifying GraphQL types or resolvers, regenerate the schema:

```bash
yarn grats
```

This will update `schema.ts` and `schema.graphql` which are used by GraphQL Yoga.

### Generating GraphQL Types

After making schema changes, generate TypeScript types for the frontend:

```bash
yarn codegen
```

**Note**: The web dev server must be running at `http://localhost:3000` for codegen to work.

## API Endpoints

- **GraphQL**: `/api/graphql` - Main GraphQL endpoint
- **REST**: `/api/site-diary` - Site diary CRUD operations

## Development Workflow

1. Modify query/mutation files in `src/app/api/graphql/` with Grats JSDoc decorators
2. Run `yarn grats` to regenerate `schema.ts` and `schema.graphql`
3. Run `yarn codegen` to regenerate TypeScript types for both the web frontend and mobile app

**Note**: The web dev server must be running for codegen to work.
