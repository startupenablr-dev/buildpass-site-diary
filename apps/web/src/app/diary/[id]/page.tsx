import { DiaryDetail } from '@/components/site-diary/diary-detail';
import { Button } from '@/components/ui/button';
import { SITE_DIARY } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import Link from 'next/link';
import { Suspense } from 'react';

interface DiaryDetailPageProps {
  params: Promise<{ id: string }>;
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/diary">← Back to List</Link>
        </Button>
      </div>

      <PreloadQuery
        query={SITE_DIARY}
        variables={{ id }}
      >
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading diary entry...</p>
            </div>
          }
        >
          <DiaryDetail id={id} />
        </Suspense>
      </PreloadQuery>
    </div>
  );
};

export default DiaryDetailPage;
