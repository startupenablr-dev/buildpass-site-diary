import { DiaryList } from '@/components/site-diary/diary-list';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader } from '@/components/layout';
import { SITE_DIARIES } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const DiaryListPage: React.FC = () => {
  return (
    <PageContainer maxWidth="7xl">
      <PageHeader
        title="Site Diaries"
        description="View all site diary entries"
        actions={
          <Button asChild className="w-full sm:w-auto h-11">
            <Link href="/diary/create">
              <Plus className="mr-2 size-4" />
              Create Entry
            </Link>
          </Button>
        }
      />

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
    </PageContainer>
  );
};

export default DiaryListPage;
