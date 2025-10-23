# BuildPass Documentation Index

## 📚 Quick Navigation

### 🚀 Start Here

- **[Layout & Mobile Optimization Guide](./guides/layout-mobile-optimization-guide.md)** ⭐ **MUST READ**
  - Essential patterns for all pages
  - Mobile-first best practices
  - Component usage guide
  - Common mistakes to avoid

### 👨‍💻 Developer Guides

- [Developer Onboarding](./guides/developer-onboarding.md) - Getting started
- [Frontend Coding Patterns](./guides/frontend-coding-patterns.md) - Code standards
- [Backend Coding Patterns](./guides/backend-coding-patterns.md) - Server-side patterns
- [Error Handling Reference](./guides/error-handling-reference.md) - Error flow & debugging
- [Reusable Components Reference](./guides/reusable-components-reference.md) - Component library

### 📖 Implementation Guides

- [Site Diary Pages Implementation](./guides/site-diary-pages-implementation.md) - Page structure
- [Update/Delete Implementation](./guides/update-delete-implementation.md) - CRUD operations
- [API Endpoints Reference](./guides/api-endpoints-reference.md) - GraphQL API

### 📋 Project Management

- [Quick Start Prompt](./QUICK-START-PROMPT.md) - Daily startup
- [Code Modification Rules](./CODE_MODIFICATION_RULES.md) - Contribution guidelines
- [Pre-Commit Hooks](./PRE-COMMIT-HOOKS.md) - Automated code quality checks

---

## 🎯 Core Principles

### 1. Always Use Layout Components

```tsx
import { PageContainer, PageHeader } from '@/components/layout';
```

Never create manual containers. See [Layout Guide](./guides/layout-mobile-optimization-guide.md).

### 2. Mobile-First Design

- Touch targets: 44px minimum (`h-11`)
- Text size: 16px minimum (`text-base`)
- Responsive buttons: `w-full sm:w-auto`

### 3. Consistent Patterns

- Same container widths
- Same button styling
- Same form layouts
- Same spacing scale

---

## 📱 Quick Reference

### Page Template

```tsx
<PageContainer>
  <PageHeader
    title="Page Title"
    description="Description"
    actions={<Button>Action</Button>}
  />
  {/* Content */}
</PageContainer>
```

### Button Pattern

```tsx
<Button className="h-11 w-full px-6 sm:w-auto">
  <Icon className="mr-2 size-4" />
  Button Text
</Button>
```

### Form Field Pattern

```tsx
<Label className="text-base">Field Name</Label>
<Input className="h-11 text-base" />
```

---

## 📂 Documentation Structure

```
docs/
├── README.md (this file)
├── guides/
│   ├── layout-mobile-optimization-guide.md  ⭐ PRIMARY REFERENCE
│   ├── developer-onboarding.md
│   ├── frontend-coding-patterns.md
│   ├── backend-coding-patterns.md
│   ├── reusable-components-reference.md
│   ├── site-diary-pages-implementation.md
│   ├── update-delete-implementation.md
│   └── api-endpoints-reference.md
├── analysis/
│   ├── site-diary-implementation-analysis.md
│   └── site-diary-implementation-fixes.md
├── CODE_MODIFICATION_RULES.md
└── QUICK-START-PROMPT.md
```

---

## 🤖 For AI Assistants (Claude/Copilot)

When working on this codebase:

### ✅ ALWAYS

1. Read [Layout & Mobile Optimization Guide](./guides/layout-mobile-optimization-guide.md) first
2. Use `PageContainer` and `PageHeader` for all pages
3. Use `h-11` for buttons and inputs
4. Use `text-base` for labels and inputs
5. Use `w-full sm:w-auto` for buttons
6. Put back buttons in PageHeader actions
7. Follow mobile-first responsive patterns

### ❌ NEVER

1. Create manual containers or headers
2. Use buttons smaller than h-11 (44px)
3. Use text smaller than text-base (16px) on inputs
4. Put back buttons outside PageHeader
5. Create fixed-width buttons on mobile
6. Duplicate layout code

### 📋 Checklist Before Committing

- [ ] Uses layout components
- [ ] All touch targets ≥ 44px
- [ ] All inputs have text-base
- [ ] Buttons are responsive
- [ ] No horizontal scroll on mobile
- [ ] Follows patterns in guide
- [ ] Run `yarn fix` to format and check code
- [ ] Pre-commit hooks will auto-check on commit

See [Pre-Commit Hooks Documentation](./PRE-COMMIT-HOOKS.md) for automated quality checks.

---

## 🔍 Finding Information

### "How do I create a new page?"

→ [Layout Guide](./guides/layout-mobile-optimization-guide.md) - Page Patterns section

### "What components can I use?"

→ [Reusable Components Reference](./guides/reusable-components-reference.md)

### "How do I style buttons/forms?"

→ [Layout Guide](./guides/layout-mobile-optimization-guide.md) - Mobile Optimization section

### "How do I make API calls?"

→ [API Endpoints Reference](./guides/api-endpoints-reference.md)

### "What are the code standards?"

→ [Frontend Coding Patterns](./guides/frontend-coding-patterns.md)

### "How do I get started?"

→ [Developer Onboarding](./guides/developer-onboarding.md)

---

## 📊 Current State

### ✅ Completed

- Mobile-first layout system
- Reusable layout components
- Consistent navigation (sticky navbar)
- Touch-friendly forms
- Responsive button patterns
- Comprehensive documentation

### 📝 Implementation Notes

- All pages use PageContainer/PageHeader
- Default maxWidth is 4xl (override when needed)
- Navbar is sticky with hamburger menu on mobile
- All forms have 44px touch targets
- Documentation consolidated into single guide

---

## 🆘 Need Help?

1. **Check the guide first**: [Layout & Mobile Optimization Guide](./guides/layout-mobile-optimization-guide.md)
2. **Look at examples**: See existing pages (home, diary list, create, edit)
3. **Check component docs**: See component README files
4. **Ask the team**: If still unclear

---

## 📝 Contributing

Before making changes:

1. Read [Code Modification Rules](./CODE_MODIFICATION_RULES.md)
2. Review [Layout Guide](./guides/layout-mobile-optimization-guide.md)
3. Check existing patterns
4. Test on mobile devices
5. Verify no errors (`npm run build`)

---

## 🔄 Keeping Documentation Updated

When adding new patterns or components:

1. Update [Layout Guide](./guides/layout-mobile-optimization-guide.md) if it affects layout
2. Update [Reusable Components Reference](./guides/reusable-components-reference.md) for new components
3. Update this index if adding new documentation files
4. Keep patterns consistent across all docs

---

## Version

Last Updated: October 23, 2025
Documentation Version: 3.0
