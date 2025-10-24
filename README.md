# Site Diary Application - Coding Challenge Submission

**Submitted by**: Michael Paul Quimson

This is a Next.js web application with a GraphQL API for site diary management. The project is set up as a monorepo that also includes a React Native/Expo mobile app (not part of the coding challenge, but maintained for future use). I'm excited to learn React Native once I'm comfortable and efficient in contributing to both frontend and backend development, and have mastered their respective best practices!

## Getting Started

### Prerequisites

- Node.js 22
- Yarn v1 (v1.22.22)

```bash
brew install node yarn
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

### Environment Setup

Copy the example environment file and configure your variables:

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local` with your values:

- **Required**: `API_KEY`, `NEXT_PUBLIC_API_GRAPHQL_URL`, and `OPENAI_API_KEY`
  - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

See the [Web App README](./apps/web/README.md) for detailed environment variable documentation.

## Common Commands

### Quick Fix & Quality Checks

```bash
# Fix everything (format + lint + typecheck) - Run this first!
yarn fix

# Run all CI checks (format, lint, typecheck)
yarn ci

# Format all code
yarn format

# Run linting across all workspaces
yarn lint

# Run type checking across all workspaces
yarn typecheck

# Generate GraphQL types (requires dev server running)
yarn codegen
```

### Pre-Commit Hooks

This project uses **Husky** and **lint-staged** to automatically check code quality before each commit.

When you run `git commit`:

- ✅ ESLint checks and auto-fixes staged `.js/.ts/.tsx` files
- ✅ Prettier formats staged files
- ❌ Commit blocked if there are unfixable errors

**If your commit fails:**

```bash
yarn fix        # Fix all issues
git add .       # Stage fixes
git commit -m "your message"
```

📖 See [Pre-Commit Hooks Documentation](./docs/guides/pre-commit-hooks.md) for details.

---

## 🎯 Candidate Submission Notes

### My Approach & Decisions

This submission represents my work on the coding challenge. Here's an overview of my approach and key decisions:

#### **AI-Assisted Development Strategy**

I leveraged AI/GitHub Copilot extensively throughout this project, but with careful guardrails:

- **Structured Documentation**: Created comprehensive guides in the `docs/` folder to instruct the AI on project patterns and conventions
- **Consistency Controls**: Updated `CLAUDE.md` with strict instructions to maintain existing coding patterns rather than introducing new approaches
- **Team Collaboration Focus**: Ensured the AI follows established conventions so other team members can easily understand and contribute to the codebase

#### **Developer Onboarding & Documentation** ⭐

A key focus was making it easy for new developers to jump in and start contributing immediately:

- **[Quick Start Prompt](./docs/QUICK-START-PROMPT.md)**: A universal template that enables developers to describe what they want in plain English
  - AI automatically determines if it's frontend, backend, or both
  - Handles complex workflows (GraphQL schema changes, type generation)
  - Provides complete working code with testing instructions
  - Minimal codebase knowledge required for immediate productivity (developers should still study the technologies and best practices in their own time for deeper understanding)
- **Comprehensive Guides**: Created detailed documentation covering:
  - [Developer Onboarding](./docs/guides/developer-onboarding.md) - Architecture overview and getting started
  - [Frontend Coding Patterns](./docs/guides/frontend-coding-patterns.md) - React, TypeScript, UI patterns
  - [Backend Coding Patterns](./docs/guides/backend-coding-patterns.md) - GraphQL, API patterns
  - [Layout & Mobile Optimization](./docs/guides/layout-mobile-optimization-guide.md) - Responsive design patterns
- **Self-Documenting Workflow**: The Quick Start Prompt automatically updates relevant guides when new patterns are introduced, keeping documentation in sync with code

This approach means a new developer can:

1. Read the Quick Start Prompt
2. Copy the template
3. Describe what they want to build
4. Get complete, working code that follows project conventions
5. Start contributing features on day one!

#### **Feature Implementation Highlights**

- **Site Diary CRUD Operations**: Full Create, Read, Update, Delete functionality
  - Basic form validation for required fields
  - Responsive forms optimized for mobile and desktop
- **Reusable Component Architecture**: Built modular, maintainable components
  - Layout components for consistent page structure
  - Form input components with shared styling and behavior
  - UI components from shadcn/ui for design consistency
  - Easy to extend and maintain across the application
- **AI-Powered Site Diary Summaries**: Integrated OpenAI to generate summaries of site diaries
  - Implemented rate limiting to control API usage
  - Added safeguards and error handling
  - Token management to optimize costs
- **Current Backend**: In-memory data store for rapid prototyping
- **GraphQL API**: Code-first approach using Grats for type-safe schema generation
- **Web Application**: Next.js 15 with responsive design and mobile optimization
- **Code Quality**: Pre-commit hooks with Husky and lint-staged for consistent code style

#### **Scope Note**

- **Primary Focus**: Web application with GraphQL API (coding challenge deliverable)

### Future Enhancements & Improvements

#### **File Upload Feature** ✅

**Status:** Implemented (October 24, 2025)

- **File Upload Functionality**: Real file upload with UploadThing integration
- **Implementation**: Drag & drop interface with image preview
- **Documentation**: See `docs/guides/uploadthing-integration.md`
- **Setup Required**: Add `UPLOADTHING_TOKEN` to `.env.local` (see CLAUDE.md)

---

#### **Immediate Priority: Database Implementation** 🔴

**Status**: Planned for this weekend

I plan to implement a proper database layer to make data persist:

- **PostgreSQL + Prisma ORM**
  - Currently using in-memory data store
  - Will migrate to PostgreSQL for production-ready data persistence
  - Prisma chosen for type-safe database access and excellent TypeScript integration
- **Learning Goals**:
  - Best practices for GraphQL + PostgreSQL integration
  - Prisma schema design and migrations
  - (Note: I'm more familiar with MongoDB, so this will be a great learning opportunity!)

#### **Backend Architecture Refactoring** 🟡

- **Scalability**: Refactor backend code to follow similar patterns as the frontend
  - Modular, maintainable structure
  - Clear separation of concerns
  - Better code organization for team collaboration
- **Repository Pattern**: Implement proper data access layer
- **Service Layer**: Business logic separation from resolvers

#### **Testing Strategy** 🟡

Comprehensive testing suite to be implemented:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and GraphQL resolvers
- **End-to-End Tests**: Using Playwright for web application user flow testing

#### **Additional Improvements** 🟢

- **Development Workflow & Quality**
  - Pull Request (PR) template with checklist
  - Lighthouse score requirements (must meet acceptable scores):
    - Performance optimization
    - Accessibility compliance
    - Best practices implementation
    - SEO optimization
  - Code review guidelines
- **Enhanced Form Validation**
  - Auto-scroll to input fields with errors
  - Real-time validation feedback
  - Improved error messaging
- Authentication & Authorization
- Data validation and sanitization
- API versioning strategy
- Logging and monitoring
- Performance optimization
- Documentation expansion

### Challenges & Learnings

- **Time Management**: I spent considerable time on two main areas:
  - Setting up comprehensive code patterns, best practices, and documentation focused on team collaboration and developer onboarding
  - Having experienced the pain of working on projects without documentation, I prioritized creating thorough guides to help future developers
  - Implementing the AI summary feature (got excited and invested more time than initially planned)
- **Technology Refresh**: Did a high-level refresher on React, Next.js, and GraphQL to get started. I have plans for a deep dive into these technologies since they're used at BuildPass
- **Backend Learning Curve**: Coming from a MongoDB background, learning PostgreSQL/Prisma best practices will be valuable
- **AI Collaboration**: Learning to effectively instruct AI tools while maintaining code quality was insightful

### What I Enjoyed Most

I really enjoyed implementing the AI summarization feature! It was exciting to:

- Integrate OpenAI's API
- Implement rate limiting and safeguards
- Manage token usage efficiently
- See the feature come to life with real AI-generated summaries

### Submission Status

**Completed**:

- ✅ GraphQL API setup with Grats
- ✅ Web application with responsive design
- ✅ AI-powered site diary summaries
- ✅ Rate limiting and API safeguards
- ✅ Pre-commit hooks for code quality
- ✅ Comprehensive documentation
- ✅ Mobile-optimized web interface
- ✅ File upload with UploadThing integration (October 24, 2025)

**In Progress / Planned**:

- ⏳ PostgreSQL + Prisma implementation (this weekend)
- ⏳ Backend architecture refactoring
- ⏳ Comprehensive testing suite
- ⏳ Deep dive into GraphQL + PostgreSQL best practices

---

## Documentation

### 📚 Quick Links

- **[Quick Start Prompt](./docs/QUICK-START-PROMPT.md)** - Start here for AI-assisted development ⭐
- **[Documentation Index](./docs/README.md)** - Complete guide listing
- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive reference for architecture and commands

### 🔧 Essential Guides

- [Developer Onboarding](./docs/guides/developer-onboarding.md) - Architecture overview
- [Layout & Mobile Optimization](./docs/guides/layout-mobile-optimization-guide.md) - Responsive design patterns
- [Frontend Coding Patterns](./docs/guides/frontend-coding-patterns.md) - React & TypeScript patterns
- [Backend Coding Patterns](./docs/guides/backend-coding-patterns.md) - GraphQL & API patterns
- [Reusable Components Reference](./docs/guides/reusable-components-reference.md) - UI component library

---

## 📱 Mobile App (Optional - Not Part of Coding Challenge)

The monorepo includes a React Native/Expo mobile app that shares the same GraphQL API. This was not required for the coding challenge but is maintained for future development.

### Prerequisites for Mobile Development

```bash
brew install cocoapods
```

### Running the iOS/Android App in a Simulator

For building and running apps locally, follow the [Expo setup guides](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated).

```bash
yarn workspace @untitled/mobile prebuild
yarn workspace @untitled/mobile ios
yarn workspace @untitled/mobile android
```

If you already have the app installed on your simulator, you can skip the above steps and simply run `yarn dev:mobile` to start the development server.

For app-specific documentation and how to setup your `.env` file, see the [Mobile App README](./apps/mobile/README.md).

**Note**: The mobile app demonstrates the flexibility and scalability of the GraphQL API architecture, showing how the same backend can serve multiple client platforms.
