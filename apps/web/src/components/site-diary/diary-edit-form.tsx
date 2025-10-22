'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from './date-picker';
import { ImageUploader } from './image-uploader';
import { WeatherSelector } from './weather-selector';
import { UPDATE_SITE_DIARY, SITE_DIARY } from '@/graphql/queries';
import {
  SiteDiaryQuery,
  SiteDiaryQueryVariables,
} from '@/types/__generated__/graphql';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface DiaryEditFormProps {
  id: string;
}

interface DiaryFormData {
  title: string;
  date: string;
  createdBy: string;
  content: string;
  temperature?: number;
  weatherDescription?: string;
  attendees: string;
  images: string[];
}

export const DiaryEditForm: React.FC<DiaryEditFormProps> = ({ id }) => {
  const router = useRouter();
  const { data } = useSuspenseQuery<SiteDiaryQuery, SiteDiaryQueryVariables>(
    SITE_DIARY,
    { variables: { id } },
  );
  
  const diary = data.siteDiary;
  
  const [formData, setFormData] = React.useState<DiaryFormData>({
    title: diary?.title || '',
    date: diary?.date || '',
    createdBy: diary?.createdBy || '',
    content: diary?.content || '',
    temperature: diary?.weather?.temperature || undefined,
    weatherDescription: diary?.weather?.description || undefined,
    attendees: diary?.attendees?.join(', ') || '',
    images: diary?.attachments || [],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [updateDiary, { loading }] = useMutation(UPDATE_SITE_DIARY);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Creator name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Parse attendees from comma-separated string
      const attendeesList = formData.attendees
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // Prepare weather object only if both temperature and description are provided
      const weather =
        formData.temperature !== undefined && formData.weatherDescription
          ? {
              temperature: formData.temperature,
              description: formData.weatherDescription,
            }
          : undefined;

      await updateDiary({
        variables: {
          id,
          input: {
            title: formData.title,
            date: formData.date,
            createdBy: formData.createdBy,
            content: formData.content || undefined,
            weather,
            attendees: attendeesList.length > 0 ? attendeesList : undefined,
            attachments: formData.images.length > 0 ? formData.images : undefined,
          },
        },
        refetchQueries: [{ query: SITE_DIARY, variables: { id } }],
      });

      // Redirect to diary detail on success
      router.push(`/diary/${id}`);
    } catch (error) {
      console.error('Failed to update diary:', error);
      setErrors({ submit: 'Failed to update diary. Please try again.' });
    }
  };

  if (!diary) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Diary entry not found.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Daily Progress Update"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <DatePicker
          value={formData.date}
          onChange={(date) => setFormData({ ...formData, date })}
          label="Date"
          required
        />
        {errors.date && (
          <p className="text-destructive mt-2 text-sm">{errors.date}</p>
        )}
      </div>

      {/* Creator */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="createdBy">
          Created By <span className="text-destructive">*</span>
        </Label>
        <Input
          id="createdBy"
          type="text"
          placeholder="Your name"
          value={formData.createdBy}
          onChange={(e) =>
            setFormData({ ...formData, createdBy: e.target.value })
          }
          className={errors.createdBy ? 'border-destructive' : ''}
        />
        {errors.createdBy && (
          <p className="text-destructive text-sm">{errors.createdBy}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          placeholder="Describe the activities and progress for the day..."
          rows={6}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <p className="text-muted-foreground text-sm">
          Optional: Add detailed information about the site activities.
        </p>
      </div>

      {/* Weather */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Weather Information</h3>
        <WeatherSelector
          temperature={formData.temperature}
          description={formData.weatherDescription}
          onTemperatureChange={(temp) =>
            setFormData({ ...formData, temperature: temp })
          }
          onDescriptionChange={(desc) =>
            setFormData({ ...formData, weatherDescription: desc })
          }
        />
        <p className="text-muted-foreground mt-2 text-sm">
          Optional: Record the weather conditions for the day.
        </p>
      </div>

      {/* Attendees */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="attendees">Attendees</Label>
        <Input
          id="attendees"
          type="text"
          placeholder="John Doe, Jane Smith, Bob Builder"
          value={formData.attendees}
          onChange={(e) =>
            setFormData({ ...formData, attendees: e.target.value })
          }
        />
        <p className="text-muted-foreground text-sm">
          Optional: Enter names separated by commas.
        </p>
      </div>

      {/* Image Uploader */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Photos</h3>
        <ImageUploader
          images={formData.images}
          onChange={(images) => setFormData({ ...formData, images })}
        />
        <p className="text-muted-foreground mt-2 text-sm">
          Optional: Add site photos by entering image URLs.
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="min-w-[150px]">
          {loading ? 'Updating...' : 'Update Diary Entry'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/diary/${id}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
