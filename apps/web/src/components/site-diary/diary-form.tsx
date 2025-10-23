'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { DatePicker } from './date-picker';
import { ImageUploader } from './image-uploader';
import { WeatherSelector } from './weather-selector';

const CREATE_SITE_DIARY = gql`
  mutation CreateSiteDiary($input: SiteDiaryInput!) {
    createSiteDiary(input: $input) {
      id
      title
      date
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

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

export const DiaryForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<DiaryFormData>({
    title: '',
    date: '',
    createdBy: '',
    content: '',
    temperature: undefined,
    weatherDescription: undefined,
    attendees: '',
    images: [],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [createDiary, { loading }] = useMutation(CREATE_SITE_DIARY);

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

      await createDiary({
        variables: {
          input: {
            title: formData.title,
            date: formData.date,
            createdBy: formData.createdBy,
            content: formData.content || undefined,
            weather,
            attendees: attendeesList.length > 0 ? attendeesList : undefined,
            attachments:
              formData.images.length > 0 ? formData.images : undefined,
          },
        },
      });

      // Redirect to diary list on success
      router.push('/diary');
    } catch (error) {
      console.error('Failed to create diary:', error);
      setErrors({ submit: 'Failed to create diary. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-base">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="e.g., Daily Progress Update"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`h-11 text-base ${errors.title ? 'border-destructive' : ''}`}
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
        <Label htmlFor="createdBy" className="text-base">
          Created By <span className="text-destructive">*</span>
        </Label>
        <Input
          id="createdBy"
          name="createdBy"
          type="text"
          placeholder="Your name"
          value={formData.createdBy}
          onChange={(e) =>
            setFormData({ ...formData, createdBy: e.target.value })
          }
          className={`h-11 text-base ${errors.createdBy ? 'border-destructive' : ''}`}
        />
        {errors.createdBy && (
          <p className="text-destructive text-sm">{errors.createdBy}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="content" className="text-base">
          Description
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Describe the activities and progress for the day..."
          rows={6}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="min-h-[140px] text-base"
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
        <Label htmlFor="attendees" className="text-base">
          Attendees
        </Label>
        <Input
          id="attendees"
          name="attendees"
          type="text"
          placeholder="John Doe, Jane Smith, Bob Builder"
          value={formData.attendees}
          onChange={(e) =>
            setFormData({ ...formData, attendees: e.target.value })
          }
          className="h-11 text-base"
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
        <div className="border-destructive bg-destructive/10 rounded-md border p-4">
          <p className="text-destructive text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions - Stack on mobile, side-by-side on tablet+ */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full px-6 sm:w-auto"
        >
          {loading ? 'Creating...' : 'Create Diary Entry'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/diary')}
          className="h-11 w-full px-6 sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
