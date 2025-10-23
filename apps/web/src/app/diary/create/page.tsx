import { DiaryForm } from '@/components/site-diary/diary-form';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader } from '@/components/layout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CreateDiaryPage: React.FC = () => {
  return (
    <PageContainer maxWidth="2xl">
      <PageHeader
        title="Create New Diary Entry"
        description="Record site activities, weather conditions, and progress updates."
        actions={
          <Button variant="outline" asChild className="w-full sm:w-auto h-11">
            <Link href="/diary">
              <ArrowLeft className="mr-2 size-4" />
              Back to List
            </Link>
          </Button>
        }
      />

      <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-5 lg:p-6">
        <DiaryForm />
      </div>
    </PageContainer>
  );
};

export default CreateDiaryPage;
