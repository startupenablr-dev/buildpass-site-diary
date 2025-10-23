# Layout Components Guide

This directory contains reusable layout components that ensure consistent mobile-first design across the application.

## 📦 Available Components

### `<PageContainer>`

Standard page wrapper with responsive padding and max-width constraints.

```tsx
import { PageContainer } from '@/components/layout';

export default function Page() {
  return <PageContainer maxWidth="4xl">{/* Your content */}</PageContainer>;
}
```

**Props**:

- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full'` (default: `'7xl'`)
- `className`: Additional CSS classes

**Mobile Behavior**:

- Mobile: `px-4 py-6` (16px horizontal, 24px vertical)
- Tablet: `px-6 py-8` (24px horizontal, 32px vertical)
- Desktop: `px-8 py-10` (32px horizontal, 40px vertical)

---

### `<PageHeader>`

Page title with optional description and action buttons. Automatically responsive.

```tsx
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';

<PageHeader
  title="Site Diaries"
  description="View all entries"
  actions={<Button>Create New</Button>}
/>;
```

**Props**:

- `title`: Page heading (required)
- `description`: Optional subtitle
- `actions`: Optional buttons/links
- `className`: Additional CSS classes

**Mobile Behavior**:

- Mobile: Stacks vertically, full-width actions
- Tablet+: Horizontal layout with title on left, actions on right

---

### `<Section>`

Content section with optional title and description.

```tsx
import { Section } from '@/components/layout';

<Section title="Recent Entries" description="Last 7 days">
  <DiaryList />
</Section>;
```

**Props**:

- `title`: Section heading (optional)
- `description`: Section description (optional)
- `children`: Section content
- `className`: Additional CSS classes

---

### `<MobileNav>`

Fixed bottom navigation for mobile devices (hidden on desktop).

```tsx
import { MobileNav } from '@/components/layout';

// In layout.tsx
<MobileNav />;
```

**Features**:

- Touch-friendly 48px minimum touch targets
- Active state indication
- Hamburger menu for additional options
- Automatically hidden on desktop (lg: breakpoint)

---

### `<DesktopNav>`

Top navigation bar for desktop (hidden on mobile).

```tsx
import { DesktopNav } from '@/components/layout';

// In layout.tsx
<DesktopNav />;
```

**Features**:

- Horizontal navigation with hover states
- Brand/logo section
- Primary action button
- Automatically hidden on mobile

---

## 🎯 Usage Patterns

### Standard Page Layout

```tsx
import { PageContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyPage() {
  return (
    <PageContainer maxWidth="4xl">
      <PageHeader
        title="My Page"
        description="Page description"
        actions={
          <Button asChild className="h-11 w-full sm:w-auto">
            <Link href="/create">Create</Link>
          </Button>
        }
      />

      {/* Your content */}
    </PageContainer>
  );
}
```

### List Page with Sections

```tsx
import { PageContainer, PageHeader, Section } from '@/components/layout';

export default function ListPage() {
  return (
    <PageContainer maxWidth="7xl">
      <PageHeader title="All Items" />

      <Section title="Active Items" description="Currently in progress">
        <ActiveItemsList />
      </Section>

      <Section title="Completed Items" description="Finished work">
        <CompletedItemsList />
      </Section>
    </PageContainer>
  );
}
```

### Form Page

```tsx
import { PageContainer, PageHeader } from '@/components/layout';

export default function FormPage() {
  return (
    <PageContainer maxWidth="2xl">
      <PageHeader title="Create Entry" description="Fill in the details" />

      <div className="bg-card rounded-lg border p-4 sm:p-6">
        <MyForm />
      </div>
    </PageContainer>
  );
}
```

---

## 📱 Mobile Optimization

All layout components follow these principles:

1. **Touch Targets**: Minimum 44px, recommended 48px
2. **Responsive Padding**: Increases from mobile → tablet → desktop
3. **Flexible Layouts**: Stack on mobile, side-by-side on tablet+
4. **Full-Width Buttons**: On mobile for easy tapping
5. **Safe Areas**: Support for notched devices

---

## 🎨 Customization

All components accept a `className` prop for customization:

```tsx
<PageContainer className="bg-muted">
  <PageHeader className="mb-12" title="Custom Spacing" />
  <Section className="border-t pt-8" title="Custom Section">
    {/* Content */}
  </Section>
</PageContainer>
```

---

## 🚀 Migration Guide

To migrate existing pages to use layout components:

**Before**:

```tsx
export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Title</h1>
        <Button>Action</Button>
      </div>
      {/* Content */}
    </div>
  );
}
```

**After**:

```tsx
import { PageContainer, PageHeader } from '@/components/layout';

export default function Page() {
  return (
    <PageContainer>
      <PageHeader title="Title" actions={<Button>Action</Button>} />
      {/* Content */}
    </PageContainer>
  );
}
```

**Benefits**:

- Consistent spacing across all pages
- Mobile optimizations built-in
- Less code duplication
- Easier to maintain
- Better accessibility

---

## 📚 See Also

- [Mobile Optimization Guidelines](../../../MOBILE_OPTIMIZATION_GUIDELINES.md)
- [Component Documentation](../ui/README.md)
- [Design System](../../../docs/design-system.md)
