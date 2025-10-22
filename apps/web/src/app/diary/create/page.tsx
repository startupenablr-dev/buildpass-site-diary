import { DiaryForm } from '@/components/site-diary/diary-form';
import Link from 'next/link';

const CreateDiaryPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/diary"
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          ← Back to List
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Diary Entry</h1>
        <p className="text-muted-foreground mt-2">
          Record site activities, weather conditions, and progress updates.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <DiaryForm />
      </div>
    </div>
  );
};

export default CreateDiaryPage;
