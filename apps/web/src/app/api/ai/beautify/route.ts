import {
  createErrorResponse,
  createErrorResponseFrom,
  createSuccessResponse,
} from '@/lib/api-response';
import { beautifyText, isOpenAIConfigured } from '@/lib/openai';
import type { NextRequest } from 'next/server';

/**
 * POST /api/ai/beautify
 *
 * Enhance user-entered text using OpenAI to make it more professional
 *
 * Request body:
 * {
 *   "text": "went to site today. weather was bad. did some work"
 * }
 *
 * Response:
 * {
 *   "originalText": "went to site today. weather was bad. did some work",
 *   "beautifiedText": "Visited the construction site today. Weather conditions were unfavorable. Completed assigned work tasks.",
 *   "enhanced": true
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
    const { text } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return createErrorResponse({
        code: 'INVALID_REQUEST_BODY',
        message: 'Please provide a "text" field with a string value.',
        status: 400,
      });
    }

    if (text.trim().length === 0) {
      return createSuccessResponse(
        {
          originalText: text,
          beautifiedText: text,
          enhanced: false,
        },
        'Text is empty, no enhancement needed.',
      );
    }

    // Enhance text with AI
    const beautifiedText = await beautifyText(text);

    return createSuccessResponse(
      {
        originalText: text,
        beautifiedText,
        enhanced: beautifiedText !== text,
      },
      'Text enhanced successfully',
    );
  } catch (error) {
    console.error('Error in beautify endpoint:', error);
    return createErrorResponseFrom(error, {
      code: 'AI_BEAUTIFY_FAILED',
      message: 'Failed to enhance text. Please try again later.',
      status: 500,
    });
  }
}
