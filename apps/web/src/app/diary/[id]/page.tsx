import { DiaryDetail } from '@/components/site-diary/diary-detail';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader } from '@/components/layout';
import { SITE_DIARY } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface DiaryDetailPageProps {
  params: Promise<{ id: string }>;
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <PageContainer>
      <PageHeader
        title="Diary Entry"
        description="View site activities, weather conditions, and progress updates."
        actions={
          <Button asChild variant="outline" className="w-full sm:w-auto h-11">
            <Link href="/diary">
              <ArrowLeft className="mr-2 size-4" />
              Back to List
            </Link>
          </Button>
        }
      />

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
    </PageContainer>
  );
};

export default DiaryDetailPage;
