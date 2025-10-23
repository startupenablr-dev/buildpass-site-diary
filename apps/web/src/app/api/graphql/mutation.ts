import { siteDiaries, SiteDiary, Weather } from '@/data/site-diary';
import { createGraphQLError, graphQLErrorFrom } from '@/lib/errors';
import {
  beautifyText,
  isOpenAIConfigured,
  summarizeSiteDiaries as summarizeDiariesWithAI,
} from '@/lib/openai';
import {
  buildEmptySummaryMessage,
  selectDiariesForSummary,
} from '@/lib/site-diary-summary';
import { GraphQLError } from 'graphql';
import type { Int } from 'grats';
import { nanoid } from 'nanoid';

/** @gqlInput */
interface WeatherInput {
  temperature: Int;
  description: string;
}

/** @gqlInput */
interface SiteDiaryInput {
  id?: string;
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  // Create the new diary entry with generated ID if not provided
  const newDiary: SiteDiary = {
    id: input.id || nanoid(),
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather as Weather | undefined,
    attendees: input.attendees,
    attachments: input.attachments,
  };

  // Actually save the diary to the in-memory store
  siteDiaries.push(newDiary);

  return newDiary;
}

/** @gqlMutationField */
export function updateSiteDiary(
  id: string,
  input: SiteDiaryInput,
): SiteDiary | null {
  const index = siteDiaries.findIndex((diary) => diary.id === id);

  if (index === -1) {
    return null;
  }

  // Update the diary entry
  const updatedDiary: SiteDiary = {
    id, // Keep the same ID
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather as Weather | undefined,
    attendees: input.attendees,
    attachments: input.attachments,
  };

  siteDiaries[index] = updatedDiary;
  return updatedDiary;
}

/** @gqlMutationField */
export function deleteSiteDiary(id: string): boolean {
  const index = siteDiaries.findIndex((diary) => diary.id === id);

  if (index === -1) {
    return false;
  }

  siteDiaries.splice(index, 1);
  return true;
}

// AI-powered mutations

/** @gqlType */
export type AISummaryResult = {
  /** @gqlField */
  summary: string;
  /** @gqlField */
  diariesCount: Int;
  /** @gqlField */
  startDate: string;
  /** @gqlField */
  endDate: string;
};

/** @gqlType */
export type AIBeautifyResult = {
  /** @gqlField */
  originalText: string;
  /** @gqlField */
  beautifiedText: string;
  /** @gqlField */
  enhanced: boolean;
};

/**
 * Summarize site diaries within a date range using AI
 * @gqlMutationField
 */
export async function summarizeSiteDiaries(
  startDate: string,
  endDate: string,
  limit?: Int | null,
): Promise<AISummaryResult> {
  // Check if OpenAI is configured
  if (!isOpenAIConfigured()) {
    throw createGraphQLError(
      'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.',
      {
        code: 'OPENAI_NOT_CONFIGURED',
        status: 503,
      },
    );
  }
  const normalizedLimit = typeof limit === 'number' ? limit : null;
  const {
    diaries,
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
  } = selectDiariesForSummary({
    startDate,
    endDate,
    limit: normalizedLimit ?? undefined,
  });

  if (diaries.length === 0) {
    return {
      summary: buildEmptySummaryMessage({
        diaries,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        limit: normalizedLimit,
      }),
      diariesCount: 0,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
    };
  }

  // Generate AI summary
  try {
    const summary = await summarizeDiariesWithAI(diaries);

    return {
      summary,
      diariesCount: diaries.length,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw graphQLErrorFrom(error, {
      code: 'AI_SUMMARY_FAILED',
      message: 'Failed to generate summary. Please try again later.',
      status: 500,
    });
  }
}

/**
 * Enhance user-entered text using AI to make it more professional
 * @gqlMutationField
 */
export async function beautifyTextMutation(
  text: string,
): Promise<AIBeautifyResult> {
  // Check if OpenAI is configured
  if (!isOpenAIConfigured()) {
    throw createGraphQLError(
      'OpenAI is not configured. Please set OPENAI_API_KEY in your .env.local file.',
      {
        code: 'OPENAI_NOT_CONFIGURED',
        status: 503,
      },
    );
  }

  // Validate input
  if (!text || text.trim().length === 0) {
    return {
      originalText: text,
      beautifiedText: text,
      enhanced: false,
    };
  }

  // Enhance text with AI
  try {
    const beautifiedText = await beautifyText(text);

    return {
      originalText: text,
      beautifiedText,
      enhanced: beautifiedText !== text,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw graphQLErrorFrom(error, {
      code: 'AI_BEAUTIFY_FAILED',
      message: 'Failed to enhance text. Please try again later.',
      status: 500,
    });
  }
}
