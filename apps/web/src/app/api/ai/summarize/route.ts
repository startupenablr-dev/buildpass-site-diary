import {
  createErrorResponse,
  createErrorResponseFrom,
  createSuccessResponse,
} from '@/lib/api-response';
import { isOpenAIConfigured, summarizeSiteDiaries } from '@/lib/openai';
import {
  buildEmptySummaryMessage,
  selectDiariesForSummary,
} from '@/lib/site-diary-summary';
import type { NextRequest } from 'next/server';

/**
 * POST /api/ai/summarize
 *
 * Summarize site diaries within a date range using OpenAI
 *
 * Request body:
 * {
 *   "startDate": "2024-12-01",  // Optional - defaults to 7 days ago
 *   "endDate": "2024-12-31"     // Optional - defaults to today
 * }
 *
 * Response:
 * {
 *   "summary": "AI-generated summary text",
 *   "diariesCount": 5,
 *   "dateRange": {
 *     "startDate": "2024-12-01",
 *     "endDate": "2024-12-31"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return createErrorResponse({
        code: 'OPENAI_NOT_CONFIGURED',
        message:
          'Please set OPENAI_API_KEY in your .env.local file to use AI features.',
        status: 503,
      });
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return createErrorResponse({
        code: 'INVALID_REQUEST_BODY',
        message: 'Request body must be a JSON object.',
        status: 400,
      });
    }

    const { startDate, endDate } = body as {
      startDate?: string;
      endDate?: string;
    };

    // Default to last 7 days if no dates provided
    const end = endDate || new Date().toISOString().split('T')[0];
    const start =
      startDate ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const {
      diaries,
      startDate: normalizedStart,
      endDate: normalizedEnd,
    } = selectDiariesForSummary({ startDate: start, endDate: end });

    if (diaries.length === 0) {
      return createErrorResponse({
        code: 'SITE_DIARY_NOT_FOUND',
        message: 'No site diaries found for the requested period.',
        status: 404,
        details: {
          dateRange: { startDate: normalizedStart, endDate: normalizedEnd },
          diariesCount: 0,
          helpText: buildEmptySummaryMessage({
            diaries: [],
            startDate: normalizedStart,
            endDate: normalizedEnd,
            limit: null,
          }),
        },
      });
    }

    // Generate AI summary
    const summary = await summarizeSiteDiaries(diaries);

    return createSuccessResponse(
      {
        summary,
        diariesCount: diaries.length,
        dateRange: {
          startDate: normalizedStart,
          endDate: normalizedEnd,
        },
      },
      'Summary generated successfully',
    );
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    return createErrorResponseFrom(error, {
      code: 'AI_SUMMARY_FAILED',
      message: 'Failed to generate summary. Please try again later.',
      status: 500,
    });
  }
}
