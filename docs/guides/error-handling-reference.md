# Error Handling Reference Guide

**Project:** Site Diary Management System  
**Last Updated:** October 23, 2025  
**Purpose:** Complete reference for understanding error handling flow from backend to frontend

---

## Overview

This project implements a **robust error handling system** that preserves custom error messages while hiding internal implementation details in production. This guide explains the complete error flow and addresses common questions.

---

## Error Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  1. Service Layer (lib/openai.ts, lib/site-diary.ts)       │
│     throws AppError with code, message, status, details     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  2. GraphQL Resolver (mutation.ts)                          │
│     catches error → graphQLErrorFrom → GraphQLError         │
│     with extensions: { code, http: { status }, details }    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  3. GraphQL Yoga (route.ts)                                 │
│     LOGS error to terminal (intermediate representation)    │
│     then calls maskGraphQLError → preserves clientSafe ext  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  4. HTTP Response                                            │
│     Returns JSON with proper status code (e.g., 429)        │
│     and extensions containing code, details, timestamp      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  5. Frontend (Apollo Client)                                │
│     Receives error → extractErrorInfo → displays UI         │
│     Uses extensions.code for error type mapping             │
│     Uses extensions.details.waitTimeSeconds for countdown   │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Question: Why Do Terminal Logs Show 500/INTERNAL_SERVER_ERROR?

### The Behavior

When a rate limit error occurs, you might see this in the terminal:

```
ERR GraphQLError: Rate limit exceeded. Please wait 39 seconds...
  extensions: { code: 'INTERNAL_SERVER_ERROR', status = 500, ... }
```

But the frontend correctly shows:

- Status: 429
- Code: RATE_LIMIT_EXCEEDED
- Countdown timer working

### Why This Happens

**GraphQL Yoga logs errors BEFORE the masking function runs.**

The terminal shows the **intermediate error representation** created by `graphQLErrorFrom`. This is just how GraphQL Yoga's internal logging works - it logs the error object before passing it through `maskError`.

The **actual HTTP response** sent to the client has:

- Correct status code (429)
- Correct error code (RATE_LIMIT_EXCEEDED)
- Preserved details (waitTimeSeconds, etc.)

### How to Verify

Check the browser Network tab or GraphiQL response:

```json
{
  "errors": [
    {
      "message": "Rate limit exceeded. Please wait 39 seconds...",
      "extensions": {
        "success": false,
        "code": "RATE_LIMIT_EXCEEDED",
        "http": { "status": 429 },
        "timestamp": "2025-10-23T...",
        "clientSafe": true,
        "details": {
          "waitTimeSeconds": 39,
          "maxRequestsPerWindow": 2
        }
      }
    }
  ]
}
```

### The Fix (If Needed)

If you want cleaner terminal logs, you can add a custom logger to GraphQL Yoga:

```typescript
const { handleRequest } = createYoga({
  schema: getSchema(),
  maskedErrors: { maskError: ... },

  // Optional: custom logging
  logging: {
    debug: () => {}, // Suppress debug logs
    info: () => {},  // Suppress info logs
    warn: console.warn,
    error: (message, ...args) => {
      // Only log actual server errors, not client errors
      if (message.includes('RATE_LIMIT') || message.includes('OPENAI_')) {
        return; // Skip logging expected errors
      }
      console.error(message, ...args);
    },
  },
});
```

**However**, keeping the logs is actually **useful for debugging** - you can see the full error flow in development.

---

## Backend Error Handling

### 1. Service Layer (lib/openai.ts, lib/errors.ts)

Use `AppError` for business logic errors:

```typescript
import { AppError } from '@/lib/errors';

if (rateLimitExceeded) {
  throw new AppError({
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Rate limit exceeded. Please wait 30 seconds...',
    status: 429,
    details: {
      waitTimeSeconds: 30,
      maxRequestsPerWindow: 10,
    },
  });
}
```

**Why `AppError`?**

- Structured with `code`, `message`, `status`, `details`
- Automatically detected by `normalizeError`
- Preserves all fields through error transformation

### 2. GraphQL Resolver Layer (mutation.ts, query.ts)

Convert service errors to GraphQL errors:

```typescript
import { graphQLErrorFrom, createGraphQLError } from '@/lib/errors';

export async function summarizeSiteDiaries(...): Promise<AISummaryResult> {
  try {
    const result = await summarizeDiariesWithAI(diaries);
    return result;
  } catch (error) {
    // If already a GraphQLError, re-throw
    if (error instanceof GraphQLError) {
      throw error;
    }

    // Convert AppError or Error to GraphQLError
    throw graphQLErrorFrom(error, {
      code: 'AI_SUMMARY_FAILED',
      message: 'Failed to generate summary.',
      status: 500,
    });
  }
}
```

**Pattern:**

- `graphQLErrorFrom` preserves AppError code/status/details
- Falls back to provided code/message if not AppError
- Always adds `clientSafe: true` to extensions

### 3. GraphQL Yoga Configuration (route.ts)

```typescript
import { maskGraphQLError } from '@/lib/errors';

const { handleRequest } = createYoga({
  schema: getSchema(),
  maskedErrors: {
    maskError(error, _message, isDev) {
      return maskGraphQLError(error, Boolean(isDev));
    },
  },
});
```

**What `maskGraphQLError` does:**

- **Development**: Returns error unchanged (full stack trace)
- **Production**:
  - If `extensions.clientSafe === true`: Preserve message, code, details
  - Otherwise: Replace with generic "Something went wrong"

---

## Frontend Error Handling

### 1. Extract Error Info from Apollo Client

```typescript
type ExtractedErrorInfo = {
  message: string;
  code?: string;
  details?: unknown;
};

function extractErrorInfo(error?: ApolloError | null): ExtractedErrorInfo {
  if (!error) {
    return { message: 'An unexpected error occurred.' };
  }

  const firstGraphQLError = error.graphQLErrors?.[0];

  if (firstGraphQLError) {
    return {
      message: firstGraphQLError.message ?? 'An unexpected error occurred.',
      code: firstGraphQLError.extensions?.code as string | undefined,
      details: firstGraphQLError.extensions?.details,
    };
  }

  return { message: error.message || 'An unexpected error occurred.' };
}
```

### 2. Map Error Codes to UI States

```typescript
type ErrorType =
  | 'RATE_LIMIT'
  | 'API_KEY_MISSING'
  | 'SERVICE_UNAVAILABLE'
  | 'GENERIC';

function getErrorType(message: string, code?: string): ErrorType {
  // Check code first (most reliable)
  switch (code) {
    case 'RATE_LIMIT_EXCEEDED':
    case 'OPENAI_PROVIDER_RATE_LIMIT':
      return 'RATE_LIMIT';
    case 'OPENAI_NOT_CONFIGURED':
      return 'API_KEY_MISSING';
    case 'OPENAI_SERVICE_UNAVAILABLE':
      return 'SERVICE_UNAVAILABLE';
    default:
      break;
  }

  // Fallback to message parsing
  const normalized = message.toLowerCase();
  if (normalized.includes('rate limit')) return 'RATE_LIMIT';
  if (normalized.includes('not configured')) return 'API_KEY_MISSING';

  return 'GENERIC';
}
```

### 3. Use Details for Rich UI

```typescript
const { message, code, details } = extractErrorInfo(error);
const errorType = getErrorType(message, code);

// Extract wait time for countdown
const waitSeconds =
  details && typeof details === 'object' && 'waitTimeSeconds' in details
    ? (details as { waitTimeSeconds?: number }).waitTimeSeconds
    : null;

// Show countdown UI
{
  errorType === 'RATE_LIMIT' && waitSeconds !== null && (
    <p>
      Please wait <strong>{waitSeconds}</strong> seconds...
    </p>
  );
}
```

**See:** `apps/web/src/components/ai-summary-widget.tsx` for complete implementation

---

## Error Code Reference

### Rate Limiting

| Code                         | Status | Message Pattern                                 | Details Fields                            |
| ---------------------------- | ------ | ----------------------------------------------- | ----------------------------------------- |
| `RATE_LIMIT_EXCEEDED`        | 429    | "Rate limit exceeded. Please wait X seconds..." | `waitTimeSeconds`, `maxRequestsPerWindow` |
| `OPENAI_PROVIDER_RATE_LIMIT` | 429    | "OpenAI API rate limit exceeded..."             | None                                      |

### Configuration Errors

| Code                    | Status | Message                               | Details |
| ----------------------- | ------ | ------------------------------------- | ------- |
| `OPENAI_NOT_CONFIGURED` | 503    | "OpenAI API key is not configured..." | None    |
| `OPENAI_UNAUTHORIZED`   | 401    | "Invalid OpenAI API key..."           | None    |

### Service Errors

| Code                         | Status | Message                                        | Details |
| ---------------------------- | ------ | ---------------------------------------------- | ------- |
| `OPENAI_SERVICE_UNAVAILABLE` | 503    | "OpenAI service is temporarily unavailable..." | None    |
| `AI_SUMMARY_FAILED`          | 500    | "Failed to generate summary..."                | None    |

### Generic Errors

| Code                    | Status | Message                   | Details           |
| ----------------------- | ------ | ------------------------- | ----------------- |
| `INTERNAL_SERVER_ERROR` | 500    | "Something went wrong..." | None (production) |

---

## Testing Error Handling

### 1. Test Rate Limiting

```bash
# Start dev server
yarn dev:web

# In GraphiQL (http://localhost:3000/api/graphql), run twice quickly:
mutation {
  summarizeSiteDiaries(
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  ) {
    summary
    diariesCount
  }
}
```

**Expected:**

- First call: Success
- Second call: Rate limit error with countdown

**Verify:**

- Network tab shows 429 status
- Frontend shows countdown timer
- Terminal shows error log (expected)

### 2. Test Missing API Key

Remove `OPENAI_API_KEY` from `.env.local` and restart server.

**Expected:**

- Frontend shows "API Key Not Configured" error
- Help text with setup instructions
- No countdown timer

### 3. Test Network Errors

Stop the dev server while a request is in flight.

**Expected:**

- Frontend shows generic network error
- No specific error code
- Fallback to generic error message

---

## Debugging Tips

### Check Actual Response Status

Don't rely on terminal logs alone. Check the browser:

1. Open DevTools → Network tab
2. Find the GraphQL request
3. Check Response Headers → `Status Code`
4. Check Response Body → `errors[0].extensions`

### Enable GraphQL Yoga Logging

For more detailed logs, set environment variable:

```bash
DEBUG=graphql-yoga:* yarn dev:web
```

### Inspect Apollo Client Errors

In React DevTools:

```typescript
console.log('Full error object:', JSON.stringify(error, null, 2));
console.log('GraphQL errors:', error.graphQLErrors);
console.log('Network error:', error.networkError);
```

---

## Related Documentation

- **Backend Patterns**: `docs/guides/backend-coding-patterns.md` § 8.3.1
- **Frontend Patterns**: `docs/guides/frontend-coding-patterns.md` § 9.3
- **AI Integration**: `docs/guides/ai-openai-integration.md`
- **Implementation**: `apps/web/src/lib/errors.ts`
- **Example**: `apps/web/src/components/ai-summary-widget.tsx`

---

## Summary

✅ **Terminal logs showing INTERNAL_SERVER_ERROR is normal**  
✅ **Client receives correct status codes (429, 503, etc.)**  
✅ **Error masking preserves custom messages in production**  
✅ **Frontend can extract codes and details for rich UI**

The error handling system is working as designed. Terminal logs are for debugging; client responses are what matter for end users.
