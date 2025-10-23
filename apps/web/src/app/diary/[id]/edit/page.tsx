import { PageContainer, PageHeader } from '@/components/layout';
import { DiaryEditForm } from '@/components/site-diary/diary-edit-form';
import { Button } from '@/components/ui/button';
import { SITE_DIARY } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// Force dynamic rendering for pages that fetch from GraphQL API
export const dynamic = 'force-dynamic';

interface DiaryEditPageProps {
  params: Promise<{ id: string }>;
}

const DiaryEditPage: React.FC<DiaryEditPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <PageContainer maxWidth="2xl">
      <PageHeader
        title="Edit Diary Entry"
        description="Update site activities, weather conditions, and progress."
        actions={
          <Button asChild variant="outline" className="h-11 w-full sm:w-auto">
            <Link href={`/diary/${id}`}>
              <X className="mr-2 size-4" />
              Cancel
            </Link>
          </Button>
        }
      />

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
    </PageContainer>
  );
};

export default DiaryEditPage;
