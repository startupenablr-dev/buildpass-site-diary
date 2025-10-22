import { DiaryEditForm } from '@/components/site-diary/diary-edit-form';
import { Button } from '@/components/ui/button';
import { SITE_DIARY } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import Link from 'next/link';
import { Suspense } from 'react';

interface DiaryEditPageProps {
  params: Promise<{ id: string }>;
}

const DiaryEditPage: React.FC<DiaryEditPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Diary Entry</h1>
        <Button asChild variant="outline">
          <Link href={`/diary/${id}`}>Cancel</Link>
        </Button>
      </div>

      <PreloadQuery query={SITE_DIARY} variables={{ id }}>
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading diary entry...</p>
            </div>
          }
        >
          <DiaryEditForm id={id} />
        </Suspense>
      </PreloadQuery>
    </div>
  );
};

export default DiaryEditPage;
