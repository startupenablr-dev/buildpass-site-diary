# Quick Start: Universal Prompt Template

**Use This for Everything!** 🚀

---

## 📋 Copy & Paste This Template

```markdown
I need help with the Site Diary application.

## 📝 What I Want

[Describe what you want to do in plain English]

## 📋 Additional Details (Optional)

**Current Problem/Requirement:**
[Any specific details]

**Where I Think This Lives:**
[If you know: "backend API", "frontend component", "both", "not sure"]

**Expected Outcome:**
[What success looks like]

## 📚 Context (Auto-Include These)

Please review these documents:

**Essential:**

- `CLAUDE.md` - Project overview and commands
- `docs/guides/developer-onboarding.md` - Architecture and known issues

**For Implementation:**

- `docs/guides/backend-coding-patterns.md` - Backend patterns
- `docs/guides/frontend-coding-patterns.md` - Frontend patterns
- `docs/analysis/site-diary-implementation-analysis.md` - Current issues
- `docs/analysis/site-diary-implementation-fixes.md` - Example solutions

**Requirements:**

- Follow patterns from the guides
- Maintain type safety
- If GraphQL schema changes: run `yarn grats && yarn codegen`
- Test your changes
- **Update relevant guides when changing code patterns or adding new features**

**Please:**

1. Determine if this is frontend, backend, or both
2. Show me what files to change
3. Provide the complete working code
4. Explain how to test it
```

---

## 💡 Real Examples

### Example 1: Bug Fix

```markdown
## 📝 What I Want

Fix the bug where POST /api/site-diary returns 201 success but the entry doesn't show up when I GET /api/site-diary afterward.
```

**Result:** Claude will:

- Identify this is a backend bug
- Find the mutation file
- Add the missing `siteDiaries.push(newDiary)` line
- Explain the fix and how to test

---

### Example 2: New UI Feature

```markdown
## 📝 What I Want

Create a list page at /diaries that displays all site diary entries in a responsive grid. Each card should show the title, date, creator name, and weather with an icon. Make it mobile-friendly.
```

**Result:** Claude will:

- Identify this needs frontend component
- Check if backend API exists (it does)
- Create the list component with shadcn/ui cards
- Use GraphQL query with generated types
- Add responsive grid layout
- Include loading and error states

---

### Example 3: Full-Stack Feature

```markdown
## 📝 What I Want

Add a status field to site diaries with values: draft, published, archived. Users should be able to:

1. See the status badge in the list view
2. Change the status from the detail page using a dropdown
3. Filter the list by status

Store the status in the backend and make sure it persists.
```

**Result:** Claude will:

- Identify this needs both backend and frontend
- **Backend:** Add status field to SiteDiary type, update mutations, run `yarn grats`
- **Type Gen:** Run `yarn codegen` to generate types
- **Frontend:** Add status badge to list, add dropdown to detail page, add filter UI
- Explain the complete workflow

---

### Example 4: Simple Enhancement

```markdown
## 📝 What I Want

Add a delete button to each diary card in the list. When clicked, show a confirmation dialog, then delete the entry and refresh the list.
```

**Result:** Claude will:

- Check if delete mutation exists (it doesn't)
- **Backend:** Add deleteSiteDiary mutation, run `yarn grats`
- **Type Gen:** Run `yarn codegen`
- **Frontend:** Add delete button, add confirmation dialog, wire up mutation
- Show how to test

---

## 🎯 Tips for Better Results

### ✅ Do This:

- **Be Specific:** "Add a loading spinner when fetching diaries"
- **Describe User Flow:** "When user clicks X, show Y, then Z happens"
- **Mention Current State:** "The create form exists but doesn't validate"
- **State Expected Behavior:** "Should show an error if title is empty"

### ❌ Don't Do This:

- "Fix the API" (too vague)
- "Make it better" (unclear what "better" means)
- "Add CRUD" (too broad, break it down)

---

## 🔄 The Magic Behind the Scenes

When you use the Universal Template, Claude automatically:

1. **Reads your description** in plain English
2. **Analyzes** whether it needs backend, frontend, or both
3. **References** the appropriate guide documents
4. **Follows** established patterns from the codebase
5. **Handles** the type generation workflow if needed
6. **Provides** complete, working code
7. **Explains** what changed and why
8. **Shows** how to test it

### You Don't Need To:

❌ Know if it's frontend or backend  
❌ Specify which files to edit  
❌ Remember the Grats/codegen workflow  
❌ Choose which template to use  
❌ Attach specific documentation

### Claude Handles:

✅ Layer identification  
✅ File selection  
✅ Pattern consistency  
✅ Type generation workflow  
✅ Testing guidance  
✅ Documentation updates for new patterns

---

## 📖 Keeping Documentation Updated

When implementing changes, Claude will also:

- **Update coding pattern guides** when introducing new patterns or best practices
- **Document new features** in the relevant guide sections
- **Keep examples current** by adding real-world usage examples
- **Update API references** when endpoints change
- **Maintain consistency** between code and documentation

**Which guides get updated:**

- `backend-coding-patterns.md` - New backend patterns, API changes
- `frontend-coding-patterns.md` - New UI patterns, component examples
- `api-endpoints-reference.md` - API endpoint changes
- `site-diary-implementation-analysis.md` - Known issues and solutions

---

## 🚀 Quick Start Workflow

### Step 1: Copy the Template

Copy the entire template from the top of this page.

### Step 2: Fill in "What I Want"

Replace the placeholder with your specific request in plain English.

### Step 3: Add Optional Details

Fill in any optional sections if you have more context.

### Step 4: Paste to Claude

Paste the entire prompt into Claude (Code, Chat, or Cursor).

### Step 5: Review & Test

Claude will provide code and testing steps. Follow them!

---

## 📚 When to Use Advanced Templates

**Use the Universal Template for:**

- 95% of all tasks
- Bug fixes
- New features
- UI components
- API endpoints
- Full-stack features

**Use Specialized Templates only for:**

- Major architectural refactoring
- Complex multi-phase features with many dependencies
- When you need extra structure for planning

**Location:** See `docs/claude-prompt-template.md` for specialized templates

---

## ✅ Success Checklist

Before submitting:

- [ ] Filled in "What I Want" section clearly
- [ ] Added relevant details (optional but helpful)
- [ ] Included the Context section (copy as-is)
- [ ] Described expected outcome
- [ ] Ready to test the solution

After receiving code:

- [ ] Understand what files changed
- [ ] Run any needed commands (yarn grats, yarn codegen)
- [ ] Test the changes
- [ ] Verify it works as expected
- [ ] Check that relevant guides were updated (if applicable)

---

## 🎓 Examples by Category

### Backend Tasks

```markdown
## 📝 What I Want

Add filtering to the siteDiaries query - allow filtering by date range and creator name.
```

### Frontend Tasks

```markdown
## 📝 What I Want

Make the diary list responsive - 1 column on mobile, 2 on tablet, 3 on desktop.
```

### Full-Stack Tasks

```markdown
## 📝 What I Want

Add ability to favorite diary entries. Show a star icon that users can click to favorite/unfavorite. Store favorites in the backend.
```

### Bug Fixes

```markdown
## 📝 What I Want

Fix the GraphQL createSiteDiary mutation - it returns data but doesn't actually save to the array.
```

### Enhancements

```markdown
## 📝 What I Want

Add weather icons to the diary cards instead of just showing text.
```

---

## 💬 Need Help?

**Stuck on how to describe your task?**
Think about:

- What the user does
- What they see
- What happens next

**Not sure if it's frontend or backend?**
Don't worry! Just describe what you want - Claude will figure it out.

**Want to see more examples?**
Check `docs/claude-prompt-template.md` for detailed examples and specialized templates.

---

**Ready to start?** Copy the template above and describe what you want! 🚀
