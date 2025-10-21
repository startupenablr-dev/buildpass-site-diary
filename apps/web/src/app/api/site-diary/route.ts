import { siteDiaries } from '@/data/site-diary';
import { NextRequest, NextResponse } from 'next/server';
import { SiteDiary } from '../../../data/site-diary';

export async function GET() {
  const diaries = siteDiaries.map((entry) => {
    return {
      id: entry.id,
      date: entry.date,
      title: entry.title,
      createdBy: entry.createdBy,
    };
  });

  return NextResponse.json(diaries, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
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
      throw new Error('id, date, createdBy and title are required');
    }

    return NextResponse.json(
      { message: 'Site diary created successfully', siteDiary },
      { status: 201 },
    );
  } catch (e: unknown) {
    let errorMessage = 'Unknown error';

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    return NextResponse.json(
      { error: 'Invalid request format', errorMessage },
      { status: 400 },
    );
  }
}
