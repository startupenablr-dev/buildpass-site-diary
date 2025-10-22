# ⚠️ CODE MODIFICATION RULES - READ BEFORE ANY CHANGES

**Project:** Site Diary Management System  
**Created:** October 23, 2025  
**Applies to:** All developers, AI assistants, and contributors

---

## 🎯 Golden Rule

**Make the MINIMUM change necessary to achieve the requested feature. Nothing more.**

---

## ✅ DO THESE THINGS

1. **Make targeted, minimal changes**
   - Only touch files directly related to the feature
   - Add new code alongside existing code
   - Preserve existing functionality

2. **Follow existing patterns**
   - Match the style already in the codebase
   - Use the same naming conventions
   - Copy-paste similar code as a starting point

3. **Test incrementally**
   - Test after each small change
   - Verify nothing broke before moving forward
   - Use the existing test data

4. **Use modern best practices**
   - Optional chaining (`?.`) for null safety
   - TypeScript strict typing
   - Proper error handling
   - **Use Lucide React icons (NOT emojis)**

5. **Create new files for new features**
   - Better to add a new component than modify existing
   - Keeps changes isolated and safe
   - Easier to revert if needed

6. **Check reusable components before creating**
   - Read `docs/guides/reusable-components-reference.md`
   - Reuse existing UI components (Button, Card, Badge)
   - Use Lucide icons from `lucide-react` package

---

## ❌ DON'T DO THESE THINGS

1. **Don't refactor working code (UNLESS EXPLICITLY REQUESTED)**
   - If it ain't broke, don't fix it
   - If code is working and not causing errors, **LEAVE IT ALONE**
   - If code has no bugs or potential issues, **DON'T TOUCH IT**
   - "Better organization" is NOT a valid reason to change
   - "Code quality improvement" is NOT a valid reason to change
   - **ONLY refactor when the prompt specifically asks to refactor**

2. **Don't make aesthetic changes**
   - Don't change layouts unless requested
   - Don't update styling of existing components
   - Don't reorganize project structure
   - Don't rewrite footers, headers, or navigation

3. **Don't modify unrelated files**
   - Scope changes tightly to the feature
   - One feature = minimal file changes
   - Avoid cascade changes across the codebase

4. **Don't "improve" things**
   - Don't update dependencies unnecessarily
   - Don't change error messages that work
   - Don't rewrite validation logic
   - Don't optimize prematurely
   - Don't suggest improvements unless asked

5. **Don't remove existing functionality**
   - Always preserve what exists
   - Add alongside, don't replace
   - Keep backward compatibility

6. **Don't use emojis for icons**
   - ❌ No emoji icons (👤, 📷, 📅, etc.)
   - ✅ Use Lucide React icons instead
   - ✅ Import from `lucide-react` package
   - Example: `import { Calendar, User, Camera } from 'lucide-react';`

### 🚫 REFACTORING POLICY

**When to refactor:**

- ✅ When the prompt explicitly says "refactor this code"
- ✅ When fixing an actual bug that requires refactoring
- ✅ When the existing code prevents implementing the requested feature

**When NOT to refactor:**

- ❌ Code is working fine (no errors, no bugs)
- ❌ Code doesn't follow "best practices" but works
- ❌ Code could be "cleaner" or "more organized"
- ❌ You think the code could be "improved"
- ❌ Code is not causing any issues or potential problems

**Remember:** Working code is better than "perfect" code. Stability > Style.

---

## 📋 Change Checklist

Before committing ANY change, ask yourself:

- [ ] Is this change **necessary** for the requested feature?
- [ ] Am I **only** touching files related to this feature?
- [ ] Did I **preserve** all existing functionality?
- [ ] Did I **follow** existing code patterns?
- [ ] Can I **explain** why each line was changed?
- [ ] Would removing this change break the feature? (If no, remove it)
- [ ] **Is the existing code working without errors?** (If yes, don't change it)
- [ ] **Was refactoring explicitly requested?** (If no, don't refactor)
- [ ] **Is there an actual bug or issue?** (If no, don't "fix" it)

**If you can't answer YES to all questions, remove unnecessary changes.**

### 🔍 Additional Validation Questions:

**Before changing ANY existing code:**

1. Is this code currently **causing an error**? → If NO, don't change it
2. Is this code **preventing the new feature**? → If NO, don't change it
3. Did the prompt **explicitly ask to change this**? → If NO, don't change it
4. Is there a **real bug or issue** here? → If NO, don't change it

**Default assumption: If code is working, it stays as-is.**

---

## 🎓 Examples

### ✅ GOOD: Minimal Change

**Task:** Add button to navigate to diary list

**Changes:**

```tsx
// page.tsx - ONLY added these 2 lines
import Link from 'next/link';

<Button asChild>
  <Link href="/diary">View Site Diaries</Link>
</Button>;
```

**Files changed:** 1  
**Lines added:** ~5  
**Risk:** Minimal

---

### ❌ BAD: Excessive Changes

**Task:** Add button to navigate to diary list

**Changes:**

- Rewrote entire page.tsx
- Changed header layout
- Removed original footer
- Updated styling
- Added new components
- Reorganized imports

**Files changed:** 5+  
**Lines changed:** 100+  
**Risk:** High - broke existing functionality

---

## 🚨 Red Flags

Stop and reconsider if you're doing any of these:

- 🚩 Changing more than 3 files for a simple feature
- 🚩 Rewriting code that already works
- 🚩 Updating styling that wasn't mentioned
- 🚩 Removing or replacing existing code
- 🚩 Reorganizing project structure
- 🚩 "Improving" code quality
- 🚩 Making changes "while I'm here"

---

## 🖼️ Next.js Image Configuration (Prevention)

**⚠️ PROACTIVE CHECK:** When implementing features with external images

### Common Error to Prevent:

```
Error: Invalid src prop on next/image, hostname 'example.com' is not configured
```

### Before Writing Code That Uses External Images:

**✅ DO THIS FIRST:**

1. **Identify image sources** - Where will images come from?
   - Unsplash, Cloudinary, S3, other CDNs?
   - User uploads to external storage?

2. **Configure next.config.ts IMMEDIATELY** - Don't wait for errors:

   ```typescript
   // apps/web/next.config.ts
   const nextConfig: NextConfig = {
     images: {
       remotePatterns: [
         // ✅ Best practice per Next.js docs
         {
           protocol: 'https',
           hostname: 'images.unsplash.com', // Add each external domain
           port: '',
           pathname: '/**',
         },
       ],
     },
   };
   ```

   **Why `remotePatterns`?** This is the [official Next.js recommended approach](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns) for external images. It's more secure and flexible than the deprecated `domains` config.

3. **Test with real URLs** - Use actual image URLs from the source

4. **Document in CLAUDE.md** - Add to "Next.js Image Configuration" section

### When to Check:

- ✅ Creating photo galleries or image displays
- ✅ Using data with image URLs (like site diary attachments)
- ✅ Implementing user avatars from external sources
- ✅ Any feature using `next/image` with external URLs

### Quick Validation:

```typescript
// If you see URLs like these in your data:
'https://images.unsplash.com/...';
'https://cdn.example.com/...';
'https://s3.amazonaws.com/...';

// → Configure next.config.ts BEFORE implementing the component
```

**Prevention > Fixing runtime errors**

---

## 💡 When In Doubt

**Ask yourself:** _"Would this feature work without this change?"_

- **If YES:** Remove the change
- **If NO:** Keep it, but make it minimal

---

## 📚 Where This Applies

This philosophy is documented in:

- ✅ `docs/guides/developer-onboarding.md` - Main onboarding
- ✅ `docs/guides/frontend-coding-patterns.md` - Frontend patterns
- ✅ `docs/guides/backend-coding-patterns.md` - Backend patterns
- ✅ `docs/guides/site-diary-pages-implementation.md` - Implementation example

---

## 🎯 Summary

1. **Minimal changes only**
2. **Preserve existing code**
3. **Add, don't replace**
4. **Follow existing patterns**
5. **Test incrementally**

**Remember: Every line you change is a potential bug. Change less = risk less.**

---

**Last Updated:** October 23, 2025  
**Enforcement:** Required for all code contributions
