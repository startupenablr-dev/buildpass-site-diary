import type { SiteDiary } from '@/data/site-diary';
import { AppError, isAppError } from '@/lib/errors';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: This will throw an error if OPENAI_API_KEY is not set
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting configuration
// NOTE: This is a GLOBAL rate limit (applies to all users, not per IP)
// For demo purposes - keeps implementation simple without needing Redis/database
// In production, consider per-IP or per-user limits using Redis or similar
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 2; // Maximum 2 requests per minute (for testing - increase to 10 for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check and enforce rate limiting for OpenAI API calls
 * Prevents spam and excessive API usage
 *
 * @param identifier - Unique identifier for rate limiting (e.g., 'summarize', 'beautify')
 * @throws Error if rate limit is exceeded
 */
function checkRateLimit(identifier: string): void {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // First request or window expired - reset
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    const waitTime = Math.ceil((record.resetTime - now) / 1000);
    throw new AppError({
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Please wait ${waitTime} seconds before trying again. (Max ${MAX_REQUESTS_PER_WINDOW} requests per minute)`,
      status: 429,
      details: {
        identifier,
        waitTimeSeconds: waitTime,
        maxRequestsPerWindow: MAX_REQUESTS_PER_WINDOW,
        windowMs: RATE_LIMIT_WINDOW,
      },
    });
  }

  // Increment counter
  record.count++;
}

/**
 * Summarize multiple site diaries into a single weekly/period summary
 *
 * @param diaries - Array of site diary entries to summarize
 * @returns Promise<string> - AI-generated summary text
 */
export async function summarizeSiteDiaries(
  diaries: SiteDiary[],
): Promise<string> {
  // Check rate limit before processing
  checkRateLimit('summarize');

  if (diaries.length === 0) {
    return 'No site diaries to summarize.';
  }

  // Format diaries into a readable prompt
  const diariesText = diaries
    .map((diary) => {
      const weatherInfo = diary.weather
        ? `${diary.weather.temperature}°C, ${diary.weather.description}`
        : 'Weather not recorded';

      const attendeesInfo = diary.attendees?.length
        ? `Attendees: ${diary.attendees.join(', ')}`
        : 'No attendees recorded';

      return `
Date: ${diary.date}
Title: ${diary.title}
Created By: ${diary.createdBy}
Weather: ${weatherInfo}
${attendeesInfo}
Content: ${diary.content || 'No content provided'}
---`;
    })
    .join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        {
          role: 'system',
          content: `You are a professional construction site manager assistant. Create clear, well-structured summaries of site diary entries.

Format your response as follows:

📊 OVERVIEW
Brief 1-2 sentence overview of the period

🔨 KEY ACTIVITIES
• Bullet point list of main activities
• Include progress and milestones
• Be specific and concise

🌤️ WEATHER CONDITIONS
• Weather patterns and impact on work
• Any weather-related delays or adjustments

⚠️ SAFETY & OBSERVATIONS
• Safety checks performed
• Issues identified
• Concerns raised

👥 TEAM & ATTENDANCE
• Key personnel involved
• Notable attendees at meetings

Use clear formatting with line breaks between sections. Keep it professional and actionable.`,
        },
        {
          role: 'user',
          content: `Please provide a well-structured summary of the following site diary entries:\n\n${diariesText}`,
        },
      ],
      temperature: 0.7, // Balanced creativity - natural summaries while staying professional (0=deterministic, 2=very creative)
      max_tokens: 600, // AI can write up to ~450 words
    });

    return (
      completion.choices[0]?.message?.content || 'Unable to generate summary.'
    );
  } catch (error) {
    console.error('Error summarizing site diaries:', error);
    if (isAppError(error)) {
      throw error;
    }

    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 401) {
        throw new AppError({
          code: 'OPENAI_UNAUTHORIZED',
          message: 'Invalid OpenAI API key. Please check your configuration.',
          status: 401,
        });
      }
      if (apiError.status === 429) {
        throw new AppError({
          code: 'OPENAI_PROVIDER_RATE_LIMIT',
          message: 'OpenAI API rate limit exceeded. Please try again later.',
          status: 429,
        });
      }
      if (apiError.status === 500 || apiError.status === 503) {
        throw new AppError({
          code: 'OPENAI_SERVICE_UNAVAILABLE',
          message:
            'OpenAI service is temporarily unavailable. Please try again later.',
          status: apiError.status ?? 503,
        });
      }
    }

    if (error instanceof Error) {
      throw new AppError({
        code: 'OPENAI_SUMMARY_ERROR',
        message:
          error.message ||
          'Failed to generate summary. Please try again or contact support.',
        status: 500,
      });
    }

    throw new AppError({
      code: 'OPENAI_SUMMARY_ERROR',
      message:
        'Failed to generate summary. Please try again or contact support.',
      status: 500,
    });
  }
}

/**
 * Beautify/enhance user-entered text using AI
 * Makes text more professional and well-structured
 *
 * @param text - Raw text input from user
 * @returns Promise<string> - Enhanced, professional text
 */
export async function beautifyText(text: string): Promise<string> {
  // Check rate limit before processing
  checkRateLimit('beautify');

  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional writing assistant for construction site documentation. Your task is to:
- Improve grammar, spelling, and punctuation
- Make text more professional and clear
- Maintain the original meaning and intent
- Keep the same tone (formal for reports, casual for notes)
- Ensure proper construction industry terminology
- Keep the response concise and to the point

IMPORTANT: Only return the improved text without any preamble, explanation, or meta-commentary.`,
        },
        {
          role: 'user',
          content: `Please improve and enhance this text:\n\n${text}`,
        },
      ],
      temperature: 0.5, // Lower temperature for consistent, predictable text improvements (less variation than summaries)
      max_tokens: 300, // AI can write up to ~225 words
    });

    return (
      completion.choices[0]?.message?.content?.trim() || text // Return original if AI fails
    );
  } catch (error) {
    console.error('Error beautifying text:', error);
    if (isAppError(error)) {
      throw error;
    }

    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 401) {
        throw new AppError({
          code: 'OPENAI_UNAUTHORIZED',
          message: 'Invalid OpenAI API key. Please check your configuration.',
          status: 401,
        });
      }
      if (apiError.status === 429) {
        throw new AppError({
          code: 'OPENAI_PROVIDER_RATE_LIMIT',
          message: 'OpenAI API rate limit exceeded. Please try again later.',
          status: 429,
        });
      }
      if (apiError.status === 500 || apiError.status === 503) {
        throw new AppError({
          code: 'OPENAI_SERVICE_UNAVAILABLE',
          message:
            'OpenAI service is temporarily unavailable. Please try again later.',
          status: apiError.status ?? 503,
        });
      }
    }

    if (error instanceof Error) {
      throw new AppError({
        code: 'OPENAI_BEAUTIFY_ERROR',
        message:
          error.message ||
          'Failed to enhance text. Please try again or contact support.',
        status: 500,
      });
    }

    throw new AppError({
      code: 'OPENAI_BEAUTIFY_ERROR',
      message: 'Failed to enhance text. Please try again or contact support.',
      status: 500,
    });
  }
}

/**
 * Check if OpenAI is properly configured
 *
 * @returns boolean - True if API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return (
    !!process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  );
}

/**
 * Get OpenAI configuration status
 * Useful for error messages and debugging
 *
 * @returns object with configuration details
 */
export function getOpenAIStatus() {
  const isConfigured = isOpenAIConfigured();

  return {
    isConfigured,
    message: isConfigured
      ? 'OpenAI is properly configured'
      : 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file',
  };
}
