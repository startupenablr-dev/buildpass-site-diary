import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * DELETE endpoint for removing files from UploadThing CDN
 * Used when users remove images from diary entries
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract file key from UploadThing URL
    // Supported formats: utfs.io/f/{key} or *.ufs.sh/f/{key}
    let fileKey: string | undefined;

    if (url.includes('/f/')) {
      const parts = url.split('/f/');
      fileKey = parts[parts.length - 1];

      // Remove query parameters if present
      if (fileKey?.includes('?')) {
        fileKey = fileKey.split('?')[0];
      }
    }

    if (!fileKey) {
      return NextResponse.json(
        { error: 'Invalid UploadThing URL format' },
        { status: 400 },
      );
    }

    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file', details: String(error) },
      { status: 500 },
    );
  }
}
