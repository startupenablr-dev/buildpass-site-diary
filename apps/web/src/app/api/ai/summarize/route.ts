import {
  createErrorResponse,
  createErrorResponseFrom,
  createSuccessResponse,
} from '@/lib/api-response';
import { generateDiarySummary } from '@/lib/site-diary-summary';
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

    const summaryResult = await generateDiarySummary({
      startDate: start,
      endDate: end,
    });

    if (summaryResult.status === 'empty') {
      return createErrorResponse({
        code: 'SITE_DIARY_NOT_FOUND',
        message: 'No site diaries found for the requested period.',
        status: 404,
        details: {
          dateRange: {
            startDate: summaryResult.startDate,
            endDate: summaryResult.endDate,
          },
          diariesCount: summaryResult.diariesCount,
          limit: summaryResult.limit,
          helpText: summaryResult.helpText,
        },
      });
    }

    return createSuccessResponse(
      {
        summary: summaryResult.summary,
        diariesCount: summaryResult.diariesCount,
        dateRange: {
          startDate: summaryResult.startDate,
          endDate: summaryResult.endDate,
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
