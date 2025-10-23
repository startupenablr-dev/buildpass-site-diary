'use client';

import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { SITE_DIARIES } from '../graphql/queries';

export const DiaryStats: React.FC = () => {
  const { data } = useSuspenseQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  const count = data.siteDiaries?.length || 0;
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">{count}</span>
          <span className="text-muted-foreground">
            {count === 1 ? 'diary entry' : 'diary entries'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          As of {formattedDate}
        </p>
      </div>
    </div>
  );
};
