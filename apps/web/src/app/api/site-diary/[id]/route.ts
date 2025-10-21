import { siteDiaries } from '@/data/site-diary';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  const entry = siteDiaries.find((entry) => entry.id === id);

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  // Respond with the JSON data
  return NextResponse.json(entry, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
