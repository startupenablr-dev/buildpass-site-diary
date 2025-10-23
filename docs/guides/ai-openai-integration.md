# OpenAI Integration & Rate Limiting Guide

> Updated: October 23, 2025

This guide documents the AI capabilities that power the Site Diary experience, how they are wired into our stack, and the rate limiting guardrails that keep OpenAI usage safe and cost-effective. It consolidates the previous AI feature notes, rate limiting write-ups, and refactor summaries into a single reference.

---

## Features at a Glance

| Capability              | What It Does                                                                                           | Key Entry Points                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Diary summarisation** | Generates structured insights across multiple diary entries, optionally capped to the most recent set. | `summarizeSiteDiaries` GraphQL mutation, `POST /api/ai/summarize`, `summarizeSiteDiaries()` in `lib/openai.ts` |
| **Text beautification** | Polishes free-form notes into professional copy while keeping the original intent.                     | `beautifyTextMutation` GraphQL mutation, `POST /api/ai/beautify`, `beautifyText()` in `lib/openai.ts`          |
| **Rate limit feedback** | Prevents API spam and surfaces a countdown so users know when they can retry.                          | `checkRateLimit()` in `lib/openai.ts`, `AISummaryWidget` countdown UI                                          |

---

## Setup Checklist

1. **Install dependencies** (already committed)
   ```bash
   cd apps/web
   yarn install
   ```
2. **Configure OpenAI**
   ```bash
   # apps/web/.env.local
   OPENAI_API_KEY=sk-proj-your-real-key
   ```
3. **Run the web app**
   ```bash
   yarn dev:web
   ```
4. **Regenerate types when GraphQL schema changes**
   ```bash
   yarn workspace @untitled/web grats
   yarn workspace @untitled/web codegen
   ```

`lib/openai.ts` exposes `isOpenAIConfigured()` and `getOpenAIStatus()` helpers that are used by both REST and GraphQL layers to block requests when the key is missing.

---

## Backend Architecture

### Core Services

| File                                                 | Purpose                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `apps/web/src/lib/openai.ts`                         | Initializes the OpenAI client, applies rate limiting, and exposes `summarizeSiteDiaries()` & `beautifyText()` utilities.       |
| `apps/web/src/lib/site-diary-summary.ts`             | Normalises diary selection, supporting both date-range filtering and "most recent N" mode while returning consistent metadata. |
| `apps/web/src/lib/errors.ts` & `lib/api-response.ts` | Normalise errors for GraphQL and REST, ensuring consistent status codes and payloads.                                          |

### GraphQL Surface

- **Schema additions** live in `apps/web/src/app/api/graphql/mutation.ts` with JSDoc annotations for Grats.
- `summarizeSiteDiaries` accepts `startDate`, `endDate`, and optional `limit`; it funnels selection through `selectDiariesForSummary()` before hitting OpenAI.
- `beautifyTextMutation` validates blank input, reuses `beautifyText()`, and maps errors through `graphQLErrorFrom()` for rich metadata.

### REST Surface

- `POST /api/ai/summarize` mirrors the GraphQL mutation, first defaulting missing dates (last 7 days), then calling `selectDiariesForSummary()`.
- `POST /api/ai/beautify` validates the request body and short-circuits empty strings.
- All REST handlers respond via `createSuccessResponse()` / `createErrorResponse()` to keep HTTP payloads predictable.

---

## Rate Limiting Details

| Setting          | Default                                             | Notes                                                    |
| ---------------- | --------------------------------------------------- | -------------------------------------------------------- |
| Window           | `60_000` ms (1 minute)                              | In-memory, global across both AI operations.             |
| Maximum requests | `2` per window                                      | Tuned low for demos; increase to `10` for production.    |
| Storage          | `Map<string, { count: number; resetTime: number }>` | Keyed by operation identifier (`summarize`, `beautify`). |

`checkRateLimit(identifier)` throws an `AppError` containing the wait time. Both GraphQL and REST layers surface this message verbatim, so the UI can display precise guidance.

**Adjusting limits**

```ts
// apps/web/src/lib/openai.ts
const RATE_LIMIT_WINDOW = 60 * 1000; // update window
const MAX_REQUESTS_PER_WINDOW = 2; // bump for production traffic
```

Consider moving to Redis or another shared store if you need process-level coordination.

---

## Frontend Experience (`AISummaryWidget`)

- Four options (`Recent 7`, `Recent 15`, `Last 7 Days`, `Last 30 Days`) drive either limit-based or date-range GraphQL requests.
- A shared countdown listens for rate limit errors, parses the wait time, and disables retries until the timer reaches zero.
- Copy-to-clipboard, regenerate, and diarised period stats keep the widget actionable even after the first run.

If you extend the widget, keep the helpers in `ai-summary-widget.tsx` pure and hoisted to avoid re-creating them per render.

---

## Testing the Stack

| Goal                      | Steps                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GraphQL summarisation** | 1. Start dev server. 2. Visit `http://localhost:3000/api/graphql`. 3. Run `mutation { summarizeSiteDiaries(startDate: "2024-12-01", endDate: "2024-12-31", limit: 7) { summary diariesCount } }`. |
| **GraphQL beautify**      | Use the playground with `mutation { beautifyTextMutation(text: "went to site today. weather bad") { beautifiedText enhanced } }`.                                                                 |
| **REST summarise**        | `curl -X POST http://localhost:3000/api/ai/summarize -H 'Content-Type: application/json' -d '{"startDate":"2024-12-01","endDate":"2024-12-31"}'`.                                                 |
| **REST beautify**         | `curl -X POST http://localhost:3000/api/ai/beautify -H 'Content-Type: application/json' -d '{"text":"quick note"}'`.                                                                              |
| **Rate limit UX**         | Click "Generate" repeatedly until the countdown appears; confirm it blocks retries until the timer hits zero and then auto-enables the "Try Again" action.                                        |

When expanding GraphQL schema surface, re-run `yarn workspace @untitled/web grats` and `yarn workspace @untitled/web codegen` so `apps/web/src/types/__generated__/graphql.ts` stays in sync.

---

## Troubleshooting

| Symptom                       | Likely Cause                              | Fix                                                                        |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| `OPENAI_NOT_CONFIGURED` error | Missing or placeholder API key.           | Populate `OPENAI_API_KEY` and restart the dev server.                      |
| `OPENAI_UNAUTHORIZED`         | Invalid key or revoked credential.        | Regenerate the key in the OpenAI dashboard.                                |
| `RATE_LIMIT_EXCEEDED`         | Too many requests within the rate window. | Wait for the countdown or loosen `MAX_REQUESTS_PER_WINDOW`.                |
| `OPENAI_SERVICE_UNAVAILABLE`  | Upstream outage.                          | Retry later; consider wrapping calls with circuit breaking for production. |

All OpenAI errors surface as `AppError` instances, which means GraphQL extensions include `code`, `http.status`, `timestamp`, and optional diagnostics.

---

## Maintenance Tips

- Keep `lib/openai.ts` the single source of truth for rate limiting and OpenAI configuration to avoid divergence.
- Centralised diary selection lives in `lib/site-diary-summary.ts`; reuse it for any new summary-like features to stay DRY.
- Whenever you move beyond in-memory rate limiting, extract the logic behind an interface so it can swap between memory, Redis, or another provider.
- Document any new AI flow additions in this file to keep future diff reviews tidy.

---

**Questions or updates?** Drop a note in the project README or amend this guide—this is now the canonical reference for AI behaviour in the Site Diary app.
