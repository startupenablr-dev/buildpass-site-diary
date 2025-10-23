# Layout & Mobile Optimization Guide

> **Reference Guide**: Essential patterns and best practices for building consistent, mobile-first pages in the BuildPass application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required: Use Layout Components](#required-use-layout-components)
3. [Layout Component Reference](#layout-component-reference)
4. [Page Patterns](#page-patterns)
5. [Mobile Optimization Standards](#mobile-optimization-standards)
6. [Navigation Patterns](#navigation-patterns)
7. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
8. [Testing Checklist](#testing-checklist)

---

## Quick Start

### ⚠️ ALWAYS Use These Components

When creating or modifying ANY page, you MUST use these layout components:

```tsx
import { PageContainer, PageHeader } from '@/components/layout';
```

**DO NOT** create custom containers, headers, or spacing. Use the reusable components.

### Basic Page Template

```tsx
import { PageContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MyPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Page Title"
        description="Brief description of the page purpose."
        actions={
          <Button variant="outline" asChild className="h-11 w-full sm:w-auto">
            <Link href="/back-path">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
        }
      />

      {/* Your page content here */}
    </PageContainer>
  );
};

export default MyPage;
```

---

## Required: Use Layout Components

### Why This Matters

❌ **WITHOUT** layout components:

- Inconsistent spacing across pages
- Duplicate code everywhere
- Hard to maintain
- Mobile issues
- Accessibility problems

✅ **WITH** layout components:

- Consistent spacing automatically
- One place to fix issues
- Mobile-optimized by default
- Accessibility built-in
- Clean, maintainable code

### The Golden Rule

> **Never create manual containers or headers. Always use `PageContainer` and `PageHeader`.**

### ❌ DON'T Do This:

```tsx
// BAD - Manual container
const MyPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Page</h1>
        <p className="text-muted-foreground">Description</p>
      </div>
      <div className="mb-6">
        <button>Back</button>
      </div>
      {/* content */}
    </div>
  );
};
```

### ✅ DO This:

```tsx
// GOOD - Using layout components
const MyPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="My Page"
        description="Description"
        actions={<Button>Back</Button>}
      />
      {/* content */}
    </PageContainer>
  );
};
```

---

## Layout Component Reference

### 1. PageContainer

**Purpose**: Wraps all page content with consistent responsive padding and max-width.

**Default**: `maxWidth='4xl'` (comfortable reading width for most pages)

```tsx
// Use default (4xl) - Most common
<PageContainer>
  {children}
</PageContainer>

// Override for wide content
<PageContainer maxWidth="7xl">
  {children}
</PageContainer>

// Override for narrow forms
<PageContainer maxWidth="2xl">
  {children}
</PageContainer>
```

**Max Width Options**:
| Value | Use Case | Width |
|-------|----------|-------|
| `2xl` | Forms (create/edit pages) | 672px |
| `4xl` | **Default** - General content, detail pages | 896px |
| `7xl` | Lists, grids, dashboards | 1280px |

**Responsive Padding**:

- Mobile: `px-4 py-6` (16px / 24px)
- Tablet: `px-6 py-8` (24px / 32px)
- Desktop: `px-8 py-10` (32px / 40px)

### 2. PageHeader

**Purpose**: Consistent page titles, descriptions, and action buttons.

```tsx
<PageHeader
  title="Page Title" // Required
  description="Page description" // Optional
  actions={<Button>Action</Button>} // Optional
/>
```

**Features**:

- Responsive layout (stacks on mobile, side-by-side on tablet+)
- Proper heading hierarchy (h1)
- Consistent spacing
- Action buttons always in the right location

**Action Buttons Pattern**:

```tsx
actions={
  <>
    {/* Multiple actions */}
    <Button variant="outline">Back</Button>
    <Button>Primary Action</Button>
  </>
}
```

### 3. Section

**Purpose**: Group related content within a page.

```tsx
import { Section } from '@/components/layout';

<Section title="Section Title">{/* Section content */}</Section>;
```

---

## Page Patterns

### Pattern 1: List/Grid Pages (Wide)

**Use Case**: Showing multiple items in cards or table

```tsx
<PageContainer maxWidth="7xl">
  <PageHeader
    title="Site Diaries"
    description="View all site diary entries"
    actions={
      <Button asChild className="h-11 w-full sm:w-auto">
        <Link href="/diary/create">
          <Plus className="mr-2 size-4" />
          Create Entry
        </Link>
      </Button>
    }
  />

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Grid items */}
  </div>
</PageContainer>
```

**When to use**: Diary list, user list, dashboard

### Pattern 2: Form Pages (Narrow)

**Use Case**: Create/Edit forms

```tsx
<PageContainer maxWidth="2xl">
  <PageHeader
    title="Create New Entry"
    description="Fill in the form below."
    actions={
      <Button variant="outline" asChild className="h-11 w-full sm:w-auto">
        <Link href="/back">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Link>
      </Button>
    }
  />

  <Card className="p-4 sm:p-5 lg:p-6">
    <Form />
  </Card>
</PageContainer>
```

**When to use**: Create diary, edit diary, user forms

### Pattern 3: Detail Pages (Default)

**Use Case**: Viewing single item details

```tsx
<PageContainer>
  {' '}
  {/* Uses default 4xl */}
  <PageHeader
    title="Diary Entry"
    description="View entry details"
    actions={
      <Button variant="outline" asChild className="h-11 w-full sm:w-auto">
        <Link href="/diary">
          <ArrowLeft className="mr-2 size-4" />
          Back to List
        </Link>
      </Button>
    }
  />
  <Card>{/* Detail content */}</Card>
</PageContainer>
```

**When to use**: Diary detail, user profile, any single-item view

### Pattern 4: Home/Landing Pages (Default)

**Use Case**: Home page, dashboard landing

```tsx
<PageContainer>
  {' '}
  {/* Uses default 4xl */}
  <PageHeader
    title="BuildPass Site Diary"
    description="Construction site diary management"
  />
  <div className="space-y-8">{/* Stats, cards, info sections */}</div>
</PageContainer>
```

**When to use**: Home page, landing pages, welcome screens

---

## Mobile Optimization Standards

> **Context**: This app is primarily used by **field workers on construction sites** using mobile devices. All components are optimized for touch interaction, outdoor visibility, and single-handed use.

### Touch Targets (CRITICAL) ⭐

**WCAG AAA Standard**: 44px × 44px minimum
**Our Standard**: 44px minimum (h-11)

**✅ All UI components now default to mobile-friendly sizes:**

```tsx
// ✅ CORRECT - Button component defaults to h-11 (44px)
<Button>Click Me</Button>

// ✅ CORRECT - Input component uses h-11 (44px)
<Input type="text" />

// ✅ CORRECT - Icon buttons use size-11 (44px)
<Button size="icon"><Icon /></Button>

// ⚠️ Only use 'sm' size when absolutely necessary
<Button size="sm">Small Button</Button>
```

**Why this matters for construction workers:**

- ✅ Easy to tap with work gloves
- ✅ Reduces errors in bright sunlight
- ✅ Enables single-handed operation
- ✅ Faster data entry in the field

### Standard Button Pattern

**Always use this pattern for buttons**:

```tsx
<Button
  variant="outline" // or "default" for primary
  asChild // for Link composition
  className="h-11 w-full px-6 sm:w-auto" // Mobile-friendly
>
  <Link href="/path">
    <Icon className="mr-2 size-4" />
    Button Text
  </Link>
</Button>
```

**Breakdown**:

- `w-full sm:w-auto` - Full width on mobile, auto on tablet+
- `h-11` - 44px touch target (WCAG compliant)
- `px-6` - Comfortable horizontal padding
- `size-4` - Consistent icon size (16px)
- `mr-2` - Icon-text spacing

### Form Fields

**✅ All form inputs now default to mobile-optimized sizes:**

```tsx
// Labels - Keep at text-sm for visual hierarchy
<Label>Field Name</Label>

// Inputs - Now h-11 and text-base by default
<Input type="text" placeholder="Enter value" />

// Textareas - text-base by default
<Textarea placeholder="Enter description" />

// Select dropdowns
<Select>...</Select>
```

**CRITICAL: Why inputs MUST use text-base (16px):**

1. **Prevents iOS Auto-Zoom** ⭐
   - iOS Safari automatically zooms in when input font-size < 16px
   - This disrupts the entire page layout
   - Users must manually zoom out after typing
   - **Solution**: Always use `text-base` (16px) on inputs

2. **Better Field Readability**
   - Easier to read in bright outdoor conditions
   - Reduces eye strain for all-day use
   - Matches body text size for consistency

3. **No Manual Overrides Needed**
   - Input component already uses `text-base`
   - Textarea component already uses `text-base`
   - Just use the components as-is

**❌ NEVER DO THIS:**

```tsx
// This will cause iOS zoom issues
<Input className="text-sm" />
```

### Responsive Layouts

**Mobile-First Approach**:

```tsx
// Buttons - Stack on mobile, row on tablet
<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>

// Grid - 1 col mobile, 2 cols tablet, 3 cols desktop
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <Card>Item</Card>
</div>

// Form Fields - Stack on mobile, side-by-side on tablet
<div className="grid gap-4 sm:grid-cols-2">
  <Input />
  <Input />
</div>
```

### Typography Scale

```tsx
// Page titles
<h1 className="text-2xl sm:text-3xl font-bold">

// Section titles
<h2 className="text-lg sm:text-xl font-semibold">

// Body text
<p className="text-base">

// Small text
<p className="text-sm text-muted-foreground">
```

### Spacing Scale

Use Tailwind's spacing scale consistently:

```tsx
// Vertical spacing between sections
<div className="space-y-6">      // 24px - default
<div className="space-y-8">      // 32px - more breathing room

// Gap in flex/grid
<div className="gap-4">          // 16px - default
<div className="gap-6">          // 24px - more space

// Padding
<div className="p-4 sm:p-6">    // Responsive padding
```

---

## Mobile Browser Optimizations

### Touch Performance

**All interactive elements are optimized for touch:**

- ✅ **`touch-action: manipulation`** - Prevents 300ms click delay on mobile
- ✅ **`-webkit-tap-highlight-color: transparent`** - Removes blue tap highlight
- ✅ Applied to: buttons, links, inputs, all clickable elements

**What this means:**

- Instant tap response (no delay)
- Clean visual feedback (no blue flash)
- Better user experience in the field

### Focus Management

**Keyboard focus is clearly visible for accessibility:**

```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

**When this matters:**

- Users navigating with keyboard
- Accessibility compliance
- Tab navigation through forms

### iOS Safari Specific

**Input Auto-Zoom Prevention:**

All `<Input>` and `<Textarea>` components use `text-base` (16px) to prevent iOS Safari from auto-zooming when focusing on form fields.

**Why this is critical:**

- iOS Safari zooms in when input font-size < 16px
- Disrupts page layout and user flow
- Forces users to manually zoom out
- **Solution**: Our components default to 16px text

**Test on iOS Safari:**

1. Open form on iPhone
2. Tap any input field
3. Page should NOT zoom in
4. User can immediately start typing

---

## Navigation Patterns

### Sticky Top Navbar

The app uses a single sticky navbar for all screen sizes:

**Desktop (≥ 1024px)**:

- Shows full navigation links (Home, Site Diaries)
- Logo on left, nav links in center

**Mobile (< 1024px)**:

- Shows hamburger menu button
- Dropdown menu with navigation items
- Menu auto-closes on navigation

### Navigation Features

✅ **Scroll to top** - All nav links scroll to top when clicked
✅ **Active states** - Current page highlighted
✅ **Touch-friendly** - 48px minimum touch targets
✅ **Responsive** - Works on all screen sizes

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Manual Containers

```tsx
// WRONG
<div className="mx-auto max-w-4xl px-8">
  <h1>My Page</h1>
</div>
```

```tsx
// CORRECT
<PageContainer>
  <PageHeader title="My Page" />
</PageContainer>
```

### ❌ Mistake 2: Inconsistent Button Heights

```tsx
// WRONG - h-9 is too small (36px)
<Button className="h-9">Click Me</Button>
```

```tsx
// CORRECT - h-11 is touch-friendly (44px)
<Button className="h-11">Click Me</Button>
```

### ❌ Mistake 3: Small Input Text

```tsx
// WRONG - Will cause iOS zoom
<Input className="text-sm" />
```

```tsx
// CORRECT - Prevents zoom
<Input className="h-11 text-base" />
```

### ❌ Mistake 4: Buttons Not Responsive

```tsx
// WRONG - Fixed width on mobile
<Button className="w-32">Click Me</Button>
```

```tsx
// CORRECT - Full width on mobile, auto on tablet
<Button className="h-11 w-full sm:w-auto">Click Me</Button>
```

### ❌ Mistake 5: Back Buttons Outside PageHeader

```tsx
// WRONG
<PageContainer>
  <Button>Back</Button>
  <PageHeader title="..." />
</PageContainer>
```

```tsx
// CORRECT
<PageContainer>
  <PageHeader title="..." actions={<Button>Back</Button>} />
</PageContainer>
```

---

## Testing Checklist

Before committing changes, verify:

### Layout Consistency

- [ ] Uses `PageContainer` (not manual div)
- [ ] Uses `PageHeader` for title/description
- [ ] Back buttons in PageHeader actions (not separate)
- [ ] Correct maxWidth for page type

### Mobile Optimization

- [ ] All buttons are h-11 (44px minimum)
- [ ] All inputs are h-11 text-base
- [ ] Labels are text-base
- [ ] Buttons are w-full sm:w-auto
- [ ] No horizontal scrolling on mobile

### Responsive Behavior

- [ ] Content stacks properly on mobile
- [ ] Grid layouts work (1 col → 2 cols → 3 cols)
- [ ] Padding adjusts by screen size
- [ ] Typography scales appropriately

### Touch Targets

- [ ] All interactive elements ≥ 44px
- [ ] Icon buttons are size-10 or larger
- [ ] Links have enough padding
- [ ] Form fields are easy to tap

### Navigation

- [ ] Nav links work correctly
- [ ] Scroll to top on navigation
- [ ] Active states show correctly
- [ ] Hamburger menu works on mobile

---

## Component File Locations

```
apps/web/src/components/layout/
├── index.ts              # Exports all layout components
├── page-container.tsx    # Main page wrapper
├── page-header.tsx       # Page title/description/actions
├── section.tsx           # Content sections
├── desktop-nav.tsx       # Sticky navbar
└── README.md            # Component documentation
```

---

## Quick Reference Card

### Standard Imports

```tsx
import { PageContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### Standard Classes

```tsx
// Buttons
className = 'w-full sm:w-auto h-11 px-6';

// Inputs
className = 'h-11 text-base';

// Labels
className = 'text-base';

// Button Container
className = 'flex flex-col gap-3 sm:flex-row';

// Grid
className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

// Card
className = 'p-4 sm:p-5 lg:p-6';
```

### Breakpoints

- **sm**: 640px (tablet)
- **md**: 768px (large tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

---

## AI/Copilot Instructions

When Claude or GitHub Copilot assists with this codebase:

1. **ALWAYS** use `PageContainer` and `PageHeader` for pages
2. **NEVER** create manual containers or headers
3. **ALWAYS** use `h-11` for buttons and inputs
4. **ALWAYS** use `text-base` for labels and inputs
5. **ALWAYS** use `w-full sm:w-auto` for buttons
6. **ALWAYS** put back/cancel buttons in PageHeader actions
7. **ALWAYS** follow the responsive patterns shown above
8. **ALWAYS** check this guide before creating/modifying pages

**Golden Rule**: If you're about to write layout code, check this guide first.

---

## Related Documentation

- [Reusable Components Reference](./reusable-components-reference.md)
- [Frontend Coding Patterns](./frontend-coding-patterns.md)
- [Site Diary Implementation](./site-diary-pages-implementation.md)
- [Layout Components README](../../apps/web/src/components/layout/README.md)

---

## Version History

- **v3.0** (Oct 2025) - Consolidated guide, removed redundant docs
- **v2.0** (Oct 2025) - Added navigation patterns, scroll to top
- **v1.0** (Oct 2025) - Initial mobile optimization and layout components

---

## Questions?

If you're unsure about a pattern:

1. Check this guide first
2. Look at existing pages for examples
3. Check component README files
4. Ask the team

**Remember**: Consistency > Creativity when it comes to layout.
