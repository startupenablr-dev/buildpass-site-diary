# Site Diary Project - TODO Reference

**Project Status**: Core functionality complete (~95%) ✅  
**Last Updated**: October 23, 2025  
**Recent Changes**: Navigation simplified, layout standardized, documentation consolidated

---

## 🎉 Recent Updates (October 23, 2025)

### ✅ Just Completed

- **Layout System**: Comprehensive reusable layout components (`PageContainer`, `PageHeader`)
- **Navigation**: Simplified to single sticky navbar with hamburger menu on mobile
- **Consistency**: All pages now use same layout patterns and button styling
- **Documentation**: Consolidated into single comprehensive guide
- **Mobile Optimization**: Enhanced forms, touch targets, responsive layouts
- **Scroll Behavior**: Added scroll-to-top on navigation

### 📖 New Documentation

- **[Layout & Mobile Optimization Guide](./docs/guides/layout-mobile-optimization-guide.md)** ⭐ **Primary Reference**
- **[Documentation Index](./docs/README.md)** - Navigation hub for all docs

### ⚠️ Action Required

Before starting new work, **READ THIS**:
👉 **[Layout & Mobile Optimization Guide](./docs/guides/layout-mobile-optimization-guide.md)**

This guide contains:

- Required component usage (PageContainer, PageHeader)
- Mobile-first patterns
- Standard button/form styling
- Common mistakes to avoid
- AI assistant instructions

---

## ✅ Completed Features

### Core Requirements (Assessment Criteria)

- [x] **List Page** (`/diary`) - Displays all diary entries in a grid
- [x] **View/Detail Page** (`/diary/[id]`) - Shows full diary entry details
- [x] **Create Page** (`/diary/create`) - Form to create new entries
- [x] **Edit Page** (`/diary/[id]/edit`) - Form to edit existing entries
- [x] **Delete Functionality** - With confirmation dialog

### Required Fields & Components

- [x] Date picker (calendar component)
- [x] Description (textarea)
- [x] Weather selector (temperature + condition)
- [x] Image uploader (URL-based)
- [x] Creator name field
- [x] Attendees field (comma-separated)

### Technical Requirements

- [x] Next.js/React frontend and backend
- [x] Apollo Client for data fetching
- [x] GraphQL API with Grats
- [x] Shadcn UI components
- [x] GraphQL CRUD operations (Create, Read, Update, Delete)
- [x] In-memory data storage
- [x] Mobile-responsive layout (grid-based)

---

## 🔴 High Priority Tasks

### 1. Database Persistence (Highly Recommended by Assessment)

**Status**: Not started  
**Impact**: High - Currently data is lost on server restart  
**Effort**: Medium (~4-6 hours)

#### Tasks:

- [ ] Install Prisma and PostgreSQL client
  ```bash
  cd apps/web
  yarn add prisma @prisma/client
  yarn add -D prisma
  ```
- [ ] Initialize Prisma
  ```bash
  npx prisma init
  ```
- [ ] Create Prisma schema (`prisma/schema.prisma`)
  - Define `SiteDiary` model with all fields
  - Define `Weather` as embedded type or separate model
- [ ] Set up PostgreSQL database
  - Local: Docker container or Postgres.app
  - Cloud: Railway, Supabase, or Neon
- [ ] Add `DATABASE_URL` to `.env.local`
- [ ] Run migrations
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Create Prisma client instance (`src/lib/prisma.ts`)
- [ ] Update GraphQL mutations to use Prisma
  - Modify `createSiteDiary` in `mutation.ts`
  - Modify `updateSiteDiary` in `mutation.ts`
  - Modify `deleteSiteDiary` in `mutation.ts`
- [ ] Update GraphQL queries to use Prisma
  - Modify `siteDiaries` in `query.ts`
  - Modify `siteDiary` in `query.ts`
- [ ] Seed database with sample data (optional)
- [ ] Test all CRUD operations

**Files to Modify**:

- `apps/web/src/app/api/graphql/mutation.ts`
- `apps/web/src/app/api/graphql/query.ts`
- `apps/web/src/data/site-diary.ts` (may become obsolete)

**References**:

- Prisma Docs: https://www.prisma.io/docs/getting-started
- Example schema in `docs/guides/backend-coding-patterns.md`

---

## 🟡 Medium Priority Tasks

### 2. Real Image Upload Service Integration

**Status**: Not started (currently URL-based only)  
**Impact**: Medium - Improves user experience significantly  
**Effort**: Medium (~3-4 hours)

#### Option A: UploadThing (Recommended in Assessment)

- [ ] Sign up for UploadThing account
- [ ] Install UploadThing packages
  ```bash
  yarn add uploadthing @uploadthing/react
  ```
- [ ] Create UploadThing API route (`src/app/api/uploadthing/route.ts`)
- [ ] Configure UploadThing with API keys
- [ ] Update `ImageUploader` component
  - Replace URL input with file upload UI
  - Add drag-and-drop support
  - Show upload progress
  - Display image previews
- [ ] Add image compression before upload
- [ ] Handle upload errors gracefully
- [ ] Test on mobile devices (camera integration)

#### Option B: AWS S3 or Cloudinary

- [ ] Set up cloud storage account
- [ ] Create upload API endpoint
- [ ] Implement signed URLs for secure uploads
- [ ] Update image uploader component
- [ ] Add image optimization

**Files to Modify**:

- `apps/web/src/components/site-diary/image-uploader.tsx`
- `apps/web/src/app/api/uploadthing/route.ts` (new)

**Resources**:

- UploadThing: https://uploadthing.com/
- UploadThing Docs: https://docs.uploadthing.com/

---

### 3. Enhanced Mobile Optimization

**Status**: ✅ Guidelines Complete, ⚠️ Implementation In Progress  
**Impact**: High - Key requirement in assessment  
**Effort**: Low-Medium (~2-3 hours)

#### ✅ Completed:

- [x] Created comprehensive mobile optimization guidelines (500+ lines)
- [x] Created mobile optimization audit checklist (74 items)
- [x] Built reusable layout components (PageContainer, PageHeader, etc.)
- [x] Implemented mobile bottom navigation (48px touch targets)
- [x] Implemented desktop navigation
- [x] Updated root layout with proper viewport config
- [x] Added safe area inset support for notched devices
- [x] Improved global CSS for touch interactions

#### ⚠️ Pending Tasks:

**Phase 1: Update Core Components (2 hours)**

- [ ] Update Button component heights:
  - [ ] Change default from `h-9` (36px) to `h-11` (44px)
  - [ ] Change icon size from `size-9` to `size-12` (48px)
  - [ ] File: `apps/web/src/components/ui/button.tsx`
- [ ] Update Input component heights:
  - [ ] Change default from `h-9` to `h-11` (44px)
  - [ ] Add `text-base` for 16px font size
  - [ ] File: `apps/web/src/components/ui/input.tsx`
- [ ] Update Select component heights:
  - [ ] Update trigger to `h-11`
  - [ ] File: `apps/web/src/components/ui/select.tsx`

**Phase 2: Migrate Pages to New Layout (2 hours)**

- [ ] Refactor `/diary/page.tsx` to use PageContainer and PageHeader
- [ ] Refactor `/diary/create/page.tsx` to use new layout components
- [ ] Refactor `/diary/[id]/page.tsx` to use new layout components
- [ ] Refactor `/diary/[id]/edit/page.tsx` to use new layout components
- [ ] Update home page `/page.tsx` with mobile optimization

**Phase 3: Touch & Interaction (1 hour)**

- [ ] Add active states to all touchable elements:
  ```tsx
  className = 'active:scale-[0.98] transition-transform';
  ```
- [ ] Verify all cards have proper touch feedback
- [ ] Test touch targets with actual finger (not mouse)
- [ ] Add loading skeletons for better perceived performance

**Phase 4: Testing (1 hour)**

- [ ] Test on Chrome DevTools:
  - [ ] iPhone SE (375px)
  - [ ] iPhone 14 Pro (393px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] Verify no horizontal scrolling on any screen size
- [ ] Test forms with mobile keyboard
- [ ] Test navigation between pages
- [ ] Run Lighthouse mobile audit (aim for 90+ score)

**Files Created**:

- ✅ `MOBILE_OPTIMIZATION_GUIDELINES.md` - Comprehensive guidelines
- ✅ `MOBILE_OPTIMIZATION_AUDIT.md` - 74-item checklist
- ✅ `MOBILE_IMPLEMENTATION_SUMMARY.md` - Implementation status
- ✅ `apps/web/src/components/layout/` - Reusable components
  - ✅ `page-container.tsx`
  - ✅ `page-header.tsx`
  - ✅ `section.tsx`
  - ✅ `mobile-nav.tsx`
  - ✅ `desktop-nav.tsx`
  - ✅ `README.md`

**Files to Update**:

- `apps/web/src/components/ui/button.tsx` - Touch target sizes
- `apps/web/src/components/ui/input.tsx` - Input heights
- `apps/web/src/components/ui/select.tsx` - Select heights
- `apps/web/src/app/diary/page.tsx` - Use new layout
- `apps/web/src/app/diary/create/page.tsx` - Use new layout
- `apps/web/src/app/diary/[id]/page.tsx` - Use new layout
- `apps/web/src/app/diary/[id]/edit/page.tsx` - Use new layout
- `apps/web/src/components/site-diary/diary-list.tsx` - Touch feedback
- `apps/web/src/components/site-diary/diary-form.tsx` - Mobile keyboard types

**Quick Reference**:

- See `MOBILE_OPTIMIZATION_GUIDELINES.md` for standards
- See `MOBILE_OPTIMIZATION_AUDIT.md` for testing checklist
- See `MOBILE_IMPLEMENTATION_SUMMARY.md` for progress
- See `apps/web/src/components/layout/README.md` for component usage

---

### 4. Testing Implementation

**Status**: Not started (no test files exist)  
**Impact**: Medium - Shows code quality practices  
**Effort**: Medium (~4-5 hours for comprehensive coverage)

#### Tasks:

- [ ] **Set Up Testing Framework**
  ```bash
  yarn add -D jest @testing-library/react @testing-library/jest-dom
  yarn add -D @testing-library/user-event
  ```
- [ ] Configure Jest (`jest.config.js`)
- [ ] **Unit Tests**
  - [ ] Test GraphQL mutation functions
  - [ ] Test GraphQL query functions
  - [ ] Test validation utilities
  - [ ] Test date formatting utilities
- [ ] **Component Tests**
  - [ ] Test DiaryForm component
  - [ ] Test DiaryList component
  - [ ] Test DiaryDetail component
  - [ ] Test DatePicker component
  - [ ] Test WeatherSelector component
  - [ ] Test ImageUploader component
- [ ] **Integration Tests**
  - [ ] Test create diary flow
  - [ ] Test edit diary flow
  - [ ] Test delete diary flow
  - [ ] Test GraphQL API endpoints
- [ ] **E2E Tests** (Optional)
  - Set up Playwright or Cypress
  - Test complete user journeys

**Coverage Goals**:

- Mutations: 80%+
- Queries: 80%+
- Components: 60%+

**Example Test Structure**:

```
apps/web/
  src/
    __tests__/
      mutations.test.ts
      queries.test.ts
      validation.test.ts
    components/
      site-diary/
        __tests__/
          diary-form.test.tsx
          diary-list.test.tsx
```

---

## 🟢 Low Priority / Optional Enhancements

### 5. AI Features (Optional Showcase Features)

**Status**: Not started  
**Impact**: Low - Optional but impressive  
**Effort**: High (~6-8 hours)

#### Feature A: Summarize Site Diaries

- [ ] Choose AI service (OpenAI, Anthropic Claude, etc.)
- [ ] Install SDK
  ```bash
  yarn add openai
  # or
  yarn add @anthropic-ai/sdk
  ```
- [ ] Create AI summarization API endpoint
  - `POST /api/diary/summarize`
  - Accept date range parameters
  - Return structured summary
- [ ] Add "Generate Summary" button to list page
- [ ] Create summary display modal/page
- [ ] Handle AI rate limits and errors
- [ ] Add loading states and skeleton UI
- [ ] Test with various date ranges

#### Feature B: Beautify/Enhance Text Input

- [ ] Add "Enhance with AI" button to form
- [ ] Create AI enhancement endpoint
- [ ] Implement prompt engineering for construction context
- [ ] Show before/after comparison
- [ ] Allow users to accept/reject suggestions
- [ ] Add undo functionality

**API Endpoints to Create**:

- `apps/web/src/app/api/ai/summarize/route.ts`
- `apps/web/src/app/api/ai/enhance/route.ts`

**Environment Variables**:

```env
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

---

### 6. Advanced Filtering & Search

**Status**: Not started  
**Impact**: Low-Medium  
**Effort**: Medium (~2-3 hours)

#### Tasks:

- [ ] Add search bar to list page
- [ ] Implement filters:
  - [ ] Date range picker
  - [ ] Creator filter
  - [ ] Weather condition filter
  - [ ] Has attachments toggle
- [ ] Add GraphQL query variables support
- [ ] Implement debounced search
- [ ] Add "Clear filters" button
- [ ] Show active filter badges
- [ ] Persist filters in URL params

**Files to Modify**:

- `apps/web/src/app/diary/page.tsx`
- `apps/web/src/components/site-diary/diary-list.tsx`
- `apps/web/src/app/api/graphql/query.ts`

---

### 7. Pagination

**Status**: Not started  
**Impact**: Low (only matters with many entries)  
**Effort**: Low (~1-2 hours)

#### Tasks:

- [ ] Add pagination to GraphQL query
- [ ] Create pagination component (Shadcn)
- [ ] Add "Load More" button or infinite scroll
- [ ] Show total count and current page
- [ ] Optimize query performance

---

### 8. Additional Features

#### A. Export Functionality

- [ ] Export to PDF
- [ ] Export to CSV
- [ ] Email diary entry

#### B. Notifications

- [ ] Toast notifications for actions
- [ ] Success/error messages
- [ ] Undo actions (with toast)

#### C. User Authentication

- [ ] Add auth provider (Clerk, Auth0, NextAuth)
- [ ] Protect routes
- [ ] User-specific diaries
- [ ] Role-based access control

#### D. Advanced Image Features

- [ ] Image gallery with lightbox
- [ ] Image annotations/markup
- [ ] Multiple image upload at once
- [ ] Image reordering (drag-drop)

---

## 📝 Documentation Tasks

### Update README Files

**Status**: Partially complete  
**Impact**: Medium - Required for submission  
**Effort**: Low (~1-2 hours)

#### Root README.md

- [x] Basic setup instructions exist
- [ ] Add your approach/decision documentation
- [ ] Explain technology choices
- [ ] Document any compromises made
- [ ] Add section on AI tool usage (if applicable)
- [ ] Include future improvements section
- [ ] Add screenshots of the application
- [ ] Document mobile optimization efforts

#### Apps/Web README.md

- [x] Basic documentation exists
- [ ] Add database setup instructions (after implementing)
- [ ] Document environment variables
- [ ] Add API endpoint documentation
- [ ] Include GraphQL schema examples

#### Create New Documentation

- [ ] `DEPLOYMENT.md` - Deployment instructions
- [ ] `TESTING.md` - Testing guide
- [ ] `API.md` - Complete API reference
- [ ] `ARCHITECTURE.md` - System architecture overview

**Template for README Updates**:

```markdown
## My Approach

### Technology Decisions

- Why I chose Prisma over other ORMs
- Mobile-first design considerations
- Image upload strategy

### Challenges & Solutions

- Challenge 1: [Description]
  - Solution: [How you solved it]
- Challenge 2: [Description]
  - Solution: [How you solved it]

### AI Tool Usage

- Used GitHub Copilot for: [Specific uses]
- Used ChatGPT for: [Specific uses]
- Impact on development speed: [Your experience]

### Future Improvements

- Feature 1: [Why it would be valuable]
- Feature 2: [Technical approach]

### Time Breakdown

- Backend/GraphQL: X hours
- Frontend/UI: X hours
- Mobile optimization: X hours
- Testing: X hours
- Documentation: X hours
```

---

## 🚀 Pre-Submission Checklist

### Code Quality

- [ ] Run linter and fix all issues
  ```bash
  yarn lint
  ```
- [ ] Run type checker
  ```bash
  yarn typecheck
  ```
- [ ] Format all code
  ```bash
  yarn format
  ```
- [ ] Remove console.logs and debug code
- [ ] Remove commented-out code
- [ ] Check for TODO comments in code

### Testing

- [ ] Test all CRUD operations
- [ ] Test on mobile device or emulator
- [ ] Test on different browsers
- [ ] Test error scenarios
- [ ] Test with empty states
- [ ] Test with large datasets

### Documentation

- [ ] Update root README.md
- [ ] Update web app README.md
- [ ] Add screenshots to docs
- [ ] Document setup process
- [ ] Add troubleshooting section

### GraphQL API

- [ ] Test all mutations via GraphQL playground
- [ ] Verify schema is up to date (`yarn grats`)
- [ ] Test error handling
- [ ] Document example queries/mutations

### Final Checks

- [ ] Remove node_modules before zipping (if not using GitHub)
- [ ] Check .gitignore is correct
- [ ] Remove .env files (ensure they're gitignored)
- [ ] Test fresh installation
  ```bash
  git clone [your-repo]
  yarn install
  yarn dev:web
  ```
- [ ] Create a demo video (optional but impressive)

---

## 📦 Quick Command Reference

### Development

```bash
# Start web app
yarn dev:web

# Start mobile app
yarn dev:mobile

# Install dependencies
yarn install

# Run all checks
yarn ci
```

### Code Generation

```bash
# Generate GraphQL schema
yarn workspace @untitled/web grats

# Generate TypeScript types
yarn codegen
```

### Database (After Prisma Setup)

```bash
# Create migration
npx prisma migrate dev --name [migration-name]

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Testing (After Setup)

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

---

## 💡 Tips & Best Practices

### For the Assessment Submission

1. **Prioritize core functionality over fancy features**
2. **Document your thought process clearly**
3. **Show mobile considerations even if not perfect**
4. **Explain what you'd do with more time**
5. **Code quality > quantity of features**
6. **Test the happy path thoroughly**

### If Time is Limited

**Minimum for Strong Submission**:

1. Ensure all core CRUD operations work perfectly
2. Test on mobile device/simulator
3. Write clear README documentation
4. Add at least basic error handling
5. Clean up code and remove debug statements

**Nice to Have**:

1. Database persistence (highly recommended)
2. Real image upload
3. Basic tests for mutations
4. Mobile optimizations

**Skip if Pressed for Time**:

1. AI features
2. Advanced filtering
3. Extensive test coverage
4. Authentication

---

## 🎯 Estimated Time Requirements

| Task                     | Priority | Time Estimate   |
| ------------------------ | -------- | --------------- |
| Database persistence     | High     | 4-6 hours       |
| Real image upload        | Medium   | 3-4 hours       |
| Mobile optimization      | Medium   | 2-3 hours       |
| Testing setup            | Medium   | 4-5 hours       |
| AI features              | Low      | 6-8 hours       |
| Documentation            | High     | 1-2 hours       |
| **Total (Recommended)**  | -        | **14-20 hours** |
| **Total (All Optional)** | -        | **20-28 hours** |

---

## 📞 Need Help?

### Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Apollo Client**: https://www.apollographql.com/docs/react/
- **Prisma**: https://www.prisma.io/docs
- **Shadcn UI**: https://ui.shadcn.com/
- **Grats**: https://grats.capt.dev/

### Project Documentation

- See `docs/guides/` for coding patterns
- See `docs/analysis/` for implementation analysis
- See `CLAUDE.md` for comprehensive project reference

---

**Good luck! You've already completed the hardest parts! 🚀**
