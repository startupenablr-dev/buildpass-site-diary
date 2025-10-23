'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DELETE_SITE_DIARY, SITE_DIARY } from '@/graphql/queries';
import {
  SiteDiaryQuery,
  SiteDiaryQueryVariables,
} from '@/types/__generated__/graphql';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { Calendar, Camera, Edit2, Trash2, User, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface DiaryDetailProps {
  id: string;
}

export const DiaryDetail: React.FC<DiaryDetailProps> = ({ id }) => {
  const router = useRouter();
  const { data } = useSuspenseQuery<SiteDiaryQuery, SiteDiaryQueryVariables>(
    SITE_DIARY,
    { variables: { id } },
  );

  const [deleteDiary, { loading: deleting }] = useMutation(DELETE_SITE_DIARY, {
    onCompleted: () => {
      router.push('/diary');
    },
    onError: (error) => {
      console.error('Failed to delete diary:', error);
      alert('Failed to delete diary. Please try again.');
    },
  });

  const handleDelete = async () => {
    try {
      await deleteDiary({
        variables: { id },
      });
    } catch {
      // Error is handled in onError
    }
  };

  if (!data.siteDiary) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground text-lg">Diary entry not found.</p>
      </div>
    );
  }

  const { siteDiary: diary } = data;

  return (
    <div className="space-y-6">
      {/* Action Buttons - Mobile-friendly layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => router.push(`/diary/${id}/edit`)}
          className="h-11 w-full px-6 sm:w-auto"
        >
          <Edit2 className="mr-2 size-4" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={deleting}
              className="h-11 w-full px-6 sm:w-auto"
            >
              <Trash2 className="mr-2 size-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                diary entry &quot;{diary.title}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl sm:text-3xl">
              {diary.title}
            </CardTitle>
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
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
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
                    className="group bg-muted relative aspect-square overflow-hidden rounded-lg border"
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
