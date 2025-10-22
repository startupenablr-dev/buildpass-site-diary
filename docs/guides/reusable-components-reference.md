# 📦 Reusable Components Reference

**Project:** Site Diary Management System  
**Created:** October 23, 2025  
**Purpose:** Comprehensive reference of all reusable UI components, utilities, and patterns

---

## 🎯 Overview

This document catalogs all reusable components available in the project. **Always check this reference before creating new components** to avoid duplication and maintain consistency.

---

## 📍 Quick Reference

### Available UI Components (shadcn/ui)

| Component  | Location                 | Purpose            | Variants                                                              |
| ---------- | ------------------------ | ------------------ | --------------------------------------------------------------------- |
| **Button** | `@/components/ui/button` | Interactive button | default, destructive, outline, secondary, ghost, link                 |
| **Card**   | `@/components/ui/card`   | Content container  | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **Badge**  | `@/components/ui/badge`  | Status indicators  | default, secondary, destructive, outline                              |

### Available Icons (Lucide React)

| Icon Library     | Package        | Usage                                  |
| ---------------- | -------------- | -------------------------------------- |
| **Lucide Icons** | `lucide-react` | Tree-shakeable SVG icons (recommended) |

**Common icons used in project:**

- `Calendar` - Date/time indicators
- `User` - User/creator info
- `Users` - Attendees/groups
- `Camera` - Photos/attachments

### Available Utilities

| Utility   | Location                   | Purpose                                           |
| --------- | -------------------------- | ------------------------------------------------- |
| **cn()**  | `@/lib/utils`              | Merge Tailwind classes with clsx + tailwind-merge |
| **cva()** | `class-variance-authority` | Create component variants                         |

### Available Apollo Components

| Component         | Location                      | Purpose                                      |
| ----------------- | ----------------------------- | -------------------------------------------- |
| **ApolloWrapper** | `@/components/apollo-wrapper` | Apollo Client provider for client components |

---

## 🔧 UI Components (shadcn/ui)

### 1. Button Component

**File:** `apps/web/src/components/ui/button.tsx`

#### Import

```typescript
import { Button } from '@/components/ui/button';
```

#### Usage Examples

```tsx
// Default button
<Button>Click me</Button>

// Variant examples
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>
<Button variant="link">Learn more</Button>

// Size examples
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Icon button
<Button size="icon">
  <IconComponent />
</Button>

// As Link (Next.js)
<Button asChild>
  <Link href="/diary">View Diaries</Link>
</Button>

// Disabled state
<Button disabled>Loading...</Button>
```

#### Available Props

```typescript
interface ButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
  asChild?: boolean; // Use with Radix Slot for Link components
  disabled?: boolean;
  className?: string;
  // + all native button props
}
```

#### Features

- ✅ Multiple variants and sizes
- ✅ Icon support
- ✅ Can be used as Link with `asChild` prop
- ✅ Focus visible states
- ✅ Dark mode ready
- ✅ Accessible (ARIA compliant)

---

### 2. Card Components

**File:** `apps/web/src/components/ui/card.tsx`

#### Import

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
```

#### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Site Diary Entry</CardTitle>
    <CardDescription>March 15, 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Card with custom styling
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg">Custom Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p>Multiple paragraphs</p>
      <p>With spacing</p>
    </div>
  </CardContent>
</Card>

// Clickable card (from diary-list.tsx)
<Link href={`/diary/${diary.id}`} className="block">
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardHeader>
      <CardTitle className="text-lg">{diary.title}</CardTitle>
      <CardDescription>{diary.date}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {diary.content}
      </p>
    </CardContent>
  </Card>
</Link>
```

#### Component Parts

1. **Card** - Container with border, shadow, rounded corners
2. **CardHeader** - Top section with padding
3. **CardTitle** - Large, bold heading (h3)
4. **CardDescription** - Muted subtitle text
5. **CardContent** - Main content area
6. **CardFooter** - Bottom section for actions

#### Features

- ✅ Composable component family
- ✅ Consistent spacing and styling
- ✅ Dark mode support
- ✅ Fully customizable with className
- ✅ Semantic HTML structure

---

### 3. Badge Component

**File:** `apps/web/src/components/ui/badge.tsx`

#### Import

```typescript
import { Badge } from '@/components/ui/badge';
```

#### Usage Examples

```tsx
// Default badge
<Badge>New</Badge>

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Real-world example (from diary-detail.tsx)
<Badge variant="secondary" className="text-sm">
  {diary.weather?.temperature}°C - {diary.weather?.description}
</Badge>

// Multiple badges
<div className="flex gap-2">
  {attendees.map((attendee) => (
    <Badge key={attendee} variant="outline">
      {attendee}
    </Badge>
  ))}
</div>
```

#### Available Props

```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  // + all div props
}
```

#### Common Use Cases

- Weather indicators
- Status labels
- Tags and categories
- Attendee lists
- Count indicators

---

## 🛠️ Utility Functions

### 1. cn() - Class Name Utility

**File:** `apps/web/src/lib/utils.ts`

#### Purpose

Intelligently merges Tailwind CSS classes, handling conflicts and duplicates.

#### Import

```typescript
import { cn } from '@/lib/utils';
```

#### Usage Examples

```typescript
// Merge classes
cn('px-4 py-2', 'rounded-md')
// → "px-4 py-2 rounded-md"

// Handle conflicts (later takes precedence)
cn('bg-red-500', 'bg-blue-500')
// → "bg-blue-500"

// Conditional classes
cn('base-class', isActive && 'active-class', error && 'error-class')

// Component example
<div className={cn(
  'rounded-lg border',
  className // Props className overrides defaults
)} />

// With cva (component variants)
<button className={cn(buttonVariants({ variant, size }), className)} />
```

#### Why Use cn()?

- ✅ Prevents duplicate classes
- ✅ Resolves Tailwind conflicts (e.g., multiple `bg-*` classes)
- ✅ Supports conditional classes
- ✅ Better than plain template literals

---

### 2. cva() - Class Variance Authority

**Package:** `class-variance-authority`

#### Purpose

Create reusable component variants with TypeScript support.

#### Import

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
```

#### Usage Example

```typescript
// Define variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md', // base classes
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-white',
        outline: 'border bg-background hover:bg-accent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Use in component
type ButtonProps = VariantProps<typeof buttonVariants>;

function Button({ variant, size, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} />
  );
}
```

#### Benefits

- ✅ Type-safe variant props
- ✅ Reusable style combinations
- ✅ Easy to extend
- ✅ Used by all shadcn/ui components

---

## 🔌 Apollo Components

### ApolloWrapper

**File:** `apps/web/src/components/apollo-wrapper.tsx`

#### Purpose

Provides Apollo Client context to client components.

#### Import

```typescript
import { ApolloWrapper } from '@/components/apollo-wrapper';
```

#### Usage

```tsx
// In layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
```

#### Features

- ✅ Configures Apollo Client with GraphQL endpoint
- ✅ SSR-compatible with Next.js App Router
- ✅ Debug logging enabled
- ✅ In-memory cache

---

## 📋 Domain Components

### Site Diary Components

These are domain-specific components (not reusable UI primitives).

#### DiaryList

**File:** `apps/web/src/components/site-diary/diary-list.tsx`

**Purpose:** Display all diary entries in responsive grid

```tsx
import { DiaryList } from '@/components/site-diary/diary-list';

<DiaryList />;
```

#### DiaryDetail

**File:** `apps/web/src/components/site-diary/diary-detail.tsx`

**Purpose:** Display single diary entry with full details

```tsx
import { DiaryDetail } from '@/components/site-diary/diary-detail';

<DiaryDetail id="cm4lvx1rf00006fujdr7w5u9h" />;
```

---

## 🎨 Icons (Lucide React)

### Overview

**Package:** `lucide-react` (already installed)  
**Documentation:** https://lucide.dev/guide/packages/lucide-react

Lucide provides a comprehensive set of tree-shakeable SVG icons. Icons are imported as React components.

### Usage

#### Import Icons

```typescript
import { Calendar, Camera, Mail, Phone, User, Users } from 'lucide-react';
```

#### Basic Usage

```tsx
// Default size (24x24)
<Calendar />

// Custom size with Tailwind
<User className="h-4 w-4" />
<Users className="h-5 w-5" />

// With color
<Camera className="h-4 w-4 text-muted-foreground" />

// Inline with text
<div className="flex items-center gap-2">
  <Calendar className="h-4 w-4" />
  <span>March 15, 2024</span>
</div>
```

#### Common Patterns

```tsx
// Icon in button
<Button>
  <Mail className="h-4 w-4" />
  Send Email
</Button>

// Icon-only button
<Button size="icon">
  <Camera className="h-4 w-4" />
</Button>

// Section header with icon
<h3 className="flex items-center gap-2 text-lg font-semibold">
  <Users className="h-5 w-5" />
  Attendees
</h3>
```

#### Icons Used in Site Diary

| Icon       | Usage                | Size    | Example Location      |
| ---------- | -------------------- | ------- | --------------------- |
| `Calendar` | Date displays        | 16px    | diary-detail.tsx      |
| `User`     | Creator/author info  | 16px    | diary-detail.tsx      |
| `Users`    | Attendees count/list | 12-20px | diary-list/detail.tsx |
| `Camera`   | Photo attachments    | 12-20px | diary-list/detail.tsx |

### Best Practices

- ✅ Import only icons you use (tree-shakeable)
- ✅ Use consistent sizing (h-4 w-4 for inline, h-5 w-5 for headers)
- ✅ Always include className for size control
- ✅ Use `text-muted-foreground` for subtle icons
- ❌ Don't use emoji (👤, 📷) - use Lucide icons instead
- ❌ Don't use `<svg>` directly - use Lucide components

### Available Icons

Browse the full icon set at: https://lucide.dev/icons/

**Common categories:**

- **UI:** Menu, X, ChevronRight, ChevronDown
- **Communication:** Mail, Phone, MessageSquare
- **Media:** Image, Camera, Video, Music
- **Social:** User, Users, UserPlus, Heart
- **Time:** Calendar, Clock, Timer
- **Files:** File, Folder, FileText, Download
- **Actions:** Edit, Trash, Save, Plus, Minus

---

## 🎨 Component Patterns

### Pattern 1: Composable Card Layout

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Title</CardTitle>
      <Badge>Status</Badge>
    </div>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">{/* Content sections */}</div>
  </CardContent>

  <CardFooter className="justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

### Pattern 2: Button with Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button disabled={loading}>{loading ? 'Loading...' : 'Submit'}</Button>;
```

### Pattern 3: Responsive Grid with Cards

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>{/* Card content */}</Card>
  ))}
</div>
```

### Pattern 4: Badge List

```tsx
<div className="flex flex-wrap gap-2">
  {tags.map((tag) => (
    <Badge key={tag} variant="outline">
      {tag}
    </Badge>
  ))}
</div>
```

---

## 📚 Adding New shadcn/ui Components

### Installation Command

```bash
# From apps/web directory
npx shadcn@latest add <component-name>

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add textarea
```

### Configuration

**File:** `apps/web/components.json`

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "slate",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

---

## ✅ Before Creating New Components

**Checklist:**

1. [ ] Check if shadcn/ui has this component
2. [ ] Check existing UI components in `@/components/ui/`
3. [ ] Check if similar pattern exists in domain components
4. [ ] Verify component isn't already installed but unused
5. [ ] Consider if you can compose existing components

**Example Decision Tree:**

```
Need a new component?
  │
  ├─ Is it a common UI pattern? (button, input, card)
  │  └─ YES → Check shadcn/ui catalog first
  │
  ├─ Is it domain-specific? (diary entry, user profile)
  │  └─ YES → Create in domain folder (e.g., site-diary/)
  │
  └─ Is it a utility/layout? (grid, container)
     └─ YES → Use Tailwind classes directly
```

---

## 🔗 References

- **shadcn/ui Catalog:** https://ui.shadcn.com
- **Radix UI (primitives):** https://www.radix-ui.com
- **CVA Documentation:** https://cva.style
- **Tailwind Merge:** https://github.com/dcastil/tailwind-merge

---

## 📝 Maintenance Notes

**When to update this document:**

- ✅ New shadcn/ui component installed
- ✅ New reusable utility created
- ✅ New component pattern established
- ✅ Component API changes

**Last Updated:** October 23, 2025

---

## 🎯 Summary

### Available Now

- **3 UI Components:** Button, Card family, Badge
- **Icon Library:** Lucide React (tree-shakeable SVG icons)
- **2 Utilities:** cn(), cva()
- **1 Provider:** ApolloWrapper
- **2 Domain Components:** DiaryList, DiaryDetail

### Common Imports

```typescript
// UI Components

// Apollo
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Utilities
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@apollo/client/react';
import { cva, type VariantProps } from 'class-variance-authority';
// Icons (Lucide React)
import { Calendar, Camera, User, Users } from 'lucide-react';
import Image from 'next/image';
// Next.js
import Link from 'next/link';
```

**Remember:** Always reuse before recreating! 🚀
