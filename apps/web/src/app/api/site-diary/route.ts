import { siteDiaries, type SiteDiary } from '@/data/site-diary';
import {
  createErrorResponseFrom,
  createSuccessResponse,
} from '@/lib/api-response';
import { AppError } from '@/lib/errors';
import type { NextRequest } from 'next/server';

export async function GET() {
  const diaries = siteDiaries.map((entry) => {
    return {
      id: entry.id,
      date: entry.date,
      title: entry.title,
      createdBy: entry.createdBy,
    };
  });

  return createSuccessResponse(
    diaries,
    'Site diary entries retrieved successfully',
  );
}

// POST handler: Create a new site diary
export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Check that id, date, createdBy and title are present, informing the user of the missing fields
    if (
      !siteDiary.id ||
      !siteDiary.date ||
      !siteDiary.createdBy ||
      !siteDiary.title
    ) {
      throw new AppError({
        code: 'VALIDATION_ERROR',
        message: 'id, date, createdBy and title are required',
        status: 400,
        details: {
          missingFields: ['id', 'date', 'createdBy', 'title'].filter(
            (field) => !(siteDiary as Record<string, unknown>)[field],
          ),
        },
      });
    }

    // Actually save the diary to the in-memory store
    siteDiaries.push(siteDiary);

    return createSuccessResponse(
      { siteDiary },
      'Site diary created successfully',
      { status: 201 },
    );
  } catch (e: unknown) {
    return createErrorResponseFrom(e, {
      code: 'SITE_DIARY_CREATE_FAILED',
      message: 'Invalid request format',
      status: 400,
    });
  }
}
