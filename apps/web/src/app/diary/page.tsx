import { DiaryList } from '@/components/site-diary/diary-list';
import { Button } from '@/components/ui/button';
import { SITE_DIARIES } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import Link from 'next/link';
import { Suspense } from 'react';

const DiaryListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Site Diaries</h1>
          <p className="mt-2 text-muted-foreground">
            View all site diary entries
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/diary/create">Create New Entry</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      <PreloadQuery query={SITE_DIARIES}>
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading diary entries...</p>
            </div>
          }
        >
          <DiaryList />
        </Suspense>
      </PreloadQuery>
    </div>
  );
};

export default DiaryListPage;
