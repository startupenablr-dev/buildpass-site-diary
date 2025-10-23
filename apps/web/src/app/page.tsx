import { AISummaryWidget } from '@/components/ai-summary-widget';
import { DiaryStats } from '@/components/diary-stats';
import { PageContainer, PageHeader } from '@/components/layout';
import { SITE_DIARIES } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import { Suspense } from 'react';

// Force dynamic rendering for pages that fetch from GraphQL API
export const dynamic = 'force-dynamic';

const Home: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="BuildPass Site Diary"
        description="Construction site diary management for field teams"
      />

      <div className="space-y-8">
        {/* Stats Section */}
        <PreloadQuery query={SITE_DIARIES}>
          <Suspense
            fallback={
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Loading statistics...</p>
              </div>
            }
          >
            <DiaryStats />
          </Suspense>
        </PreloadQuery>

        {/* AI Summary Widget */}
        <AISummaryWidget />

        {/* Features Card */}
        <div className="bg-muted/50 rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-semibold">Features</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Record daily site activities, weather conditions, attendees, and
            progress updates. All entries are accessible from any device for
            your entire team.
          </p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Create detailed diary entries with photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Track weather conditions and site visitors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Access from mobile devices in the field</span>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
