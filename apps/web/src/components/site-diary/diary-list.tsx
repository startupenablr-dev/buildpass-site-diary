'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_DIARIES } from '@/graphql/queries';
import { SiteDiariesQuery } from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { Camera, Users } from 'lucide-react';
import Link from 'next/link';

export const DiaryList: React.FC = () => {
  const { data } = useSuspenseQuery<SiteDiariesQuery>(SITE_DIARIES);

  if (!data.siteDiaries || data.siteDiaries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No diary entries found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.siteDiaries.map((diary) => (
        <Link key={diary.id} href={`/diary/${diary.id}`}>
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-lg">
                  {diary.title}
                </CardTitle>
                {diary.weather && (
                  <Badge variant="secondary" className="shrink-0">
                    {diary.weather.temperature}°C
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                <p>{new Date(diary.date).toLocaleDateString()}</p>
                <p className="text-xs">By {diary.createdBy}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {diary.content && (
                <p className="line-clamp-3 text-sm">{diary.content}</p>
              )}
              <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                {diary.attendees && diary.attendees.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {diary.attendees.length} attendee(s)
                  </span>
                )}
                {diary.attachments && diary.attachments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {diary.attachments.length} photo(s)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
