# Pre-Commit Hooks Setup

This project uses **Husky** and **lint-staged** to automatically run code quality checks before each commit.

## What Happens on Commit

When you run `git commit`, the following checks run **automatically** on staged files:

### For JavaScript/TypeScript files (`*.js`, `*.ts`, `*.tsx`):

1. **ESLint** - Fixes code issues automatically
2. **Prettier** - Formats code

### For Markdown/JSON files (`*.md`, `*.json`):

1. **Prettier** - Formats files

## Available Scripts

### Quick Fix Commands

| Command          | What It Does                                  | When to Use                                                        |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| **`yarn fix`**   | Format + Lint + Typecheck                     | **Primary fix command** - Run after commit fails or before pushing |
| `yarn format`    | Format all files with Prettier                | Quick formatting only                                              |
| `yarn lint`      | Lint all workspaces with ESLint               | Check for code issues                                              |
| `yarn typecheck` | Type check all TypeScript files               | Check for type errors                                              |
| `yarn ci`        | Check format + lint + typecheck (no auto-fix) | Before pushing / CI pipeline                                       |

### Development Commands

| Command           | What It Does           |
| ----------------- | ---------------------- |
| `yarn dev:web`    | Start Next.js web app  |
| `yarn dev:mobile` | Start Expo mobile app  |
| `yarn codegen`    | Generate GraphQL types |

### Maintenance Commands

| Command             | What It Does              |
| ------------------- | ------------------------- |
| `yarn clean`        | Remove all node_modules   |
| `yarn sherif`       | Fix package.json issues   |
| `yarn sherif-check` | Check package.json issues |

## Configuration

### package.json

```json
{
  "scripts": {
    "fix": "yarn format && yarn lint && yarn typecheck",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --cache --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

### .husky/pre-commit

```bash
npx lint-staged
```

## How It Works

1. **You stage files**: `git add .`
2. **You commit**: `git commit -m "your message"`
3. **Husky triggers**: Runs the pre-commit hook
4. **lint-staged runs**:
   - Only checks **staged files** (not entire codebase)
   - Runs ESLint with auto-fix
   - Runs Prettier to format code
   - Automatically stages the fixed files
5. **Commit proceeds**: If all checks pass, commit succeeds

## Benefits

✅ **Catches errors before pushing** - No more "fix linting errors" commits
✅ **Automatic formatting** - Code is always formatted correctly
✅ **Fast** - Only checks changed files, not entire project
✅ **Team consistency** - Everyone's code follows same standards
✅ **Prevents bad commits** - Commit blocked if checks fail

## Bypass Hook (Emergency Only)

If you absolutely need to commit without running checks:

```bash
git commit --no-verify -m "emergency fix"
```

⚠️ **Use sparingly!** This should only be used in emergencies.

## Troubleshooting

### Hook not running?

Make sure Husky is installed:

```bash
yarn prepare
```

### Errors during commit?

**Option 1: Use the fix command (Recommended)**

```bash
yarn fix
git add .
git commit -m "your message"
```

**Option 2: Fix manually**

1. Check the error message
2. Fix the issues in your editor
3. Stage the fixed files: `git add .`
4. Try committing again

### Want to test without committing?

```bash
npx lint-staged
```

## Recommended Workflow

### Standard Development Flow

```bash
# 1. Make changes
vim apps/web/src/components/diary-form.tsx

# 2. Stage files
git add .

# 3. Try to commit
git commit -m "feat: add new feature"
# ❌ Pre-commit hook may fail if there are issues

# 4. If commit fails, fix everything at once
yarn fix
# ✔ Formats all files
# ✔ Runs lint checks
# ✔ Type checks TypeScript
# Shows any remaining issues to fix manually

# 5. Stage the fixes
git add .

# 6. Commit again
git commit -m "feat: add new feature"
# ✅ Should pass now

# 7. Before pushing, run comprehensive check
yarn ci
# ✅ Verifies entire codebase is correct

# 8. Push to remote
git push
```

## Example Workflow

```bash
# Make changes to files
vim apps/web/src/components/diary-form.tsx

# Stage your changes
git add apps/web/src/components/diary-form.tsx

# Commit (hooks run automatically)
git commit -m "feat: add new form field"

# Output:
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ eslint --cache --fix
# ✔ prettier --write
# ✔ Applying modifications from tasks...
# ✔ Cleaning up temporary files...
# [main abc1234] feat: add new form field
#  1 file changed, 10 insertions(+)
```

## Dependencies

- **husky** (9.1.7) - Git hooks made easy
- **lint-staged** (16.2.6) - Run linters on staged files

Both are in `devDependencies` as they're only needed during development.
