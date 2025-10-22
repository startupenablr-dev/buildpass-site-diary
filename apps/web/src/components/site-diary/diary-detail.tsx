'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_DIARY } from '@/graphql/queries';
import {
  SiteDiaryQuery,
  SiteDiaryQueryVariables,
} from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { Calendar, Camera, User, Users } from 'lucide-react';
import Image from 'next/image';

interface DiaryDetailProps {
  id: string;
}

export const DiaryDetail: React.FC<DiaryDetailProps> = ({ id }) => {
  const { data } = useSuspenseQuery<SiteDiaryQuery, SiteDiaryQueryVariables>(
    SITE_DIARY,
    { variables: { id } },
  );

  if (!data.siteDiary) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground text-lg">Diary entry not found.</p>
      </div>
    );
  }

  const { siteDiary: diary } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl">{diary.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(diary.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{diary.createdBy}</span>
              </div>
              {diary.weather && (
                <Badge variant="secondary" className="text-sm">
                  {diary.weather.description} • {diary.weather.temperature}°C
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {diary.content && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {diary.content}
              </p>
            </div>
          )}

          {diary.attendees && diary.attendees.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5" />
                Attendees ({diary.attendees.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {diary.attendees.map((attendee, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {attendee}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {diary.attachments && diary.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Camera className="h-5 w-5" />
                Photos ({diary.attachments.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {diary.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={attachment}
                      alt={`Photo ${index + 1} from ${diary.title}`}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
