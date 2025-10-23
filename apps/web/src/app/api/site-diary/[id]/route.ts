import { siteDiaries } from '@/data/site-diary';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-response';
import type { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const entry = siteDiaries.find((entry) => entry.id === id);

  if (!entry) {
    return createErrorResponse({
      code: 'SITE_DIARY_NOT_FOUND',
      message: 'Entry not found',
      status: 404,
      details: { id },
    });
  }

  return createSuccessResponse(
    entry,
    'Site diary entry retrieved successfully',
  );
}
