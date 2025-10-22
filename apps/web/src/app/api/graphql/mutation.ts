import { siteDiaries, SiteDiary, Weather } from '@/data/site-diary';
import type { Int } from 'grats';
import { nanoid } from 'nanoid';

/** @gqlInput */
interface WeatherInput {
  temperature: Int;
  description: string;
}

/** @gqlInput */
interface SiteDiaryInput {
  id?: string;
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  // Create the new diary entry with generated ID if not provided
  const newDiary: SiteDiary = {
    id: input.id || nanoid(),
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather as Weather | undefined,
    attendees: input.attendees,
    attachments: input.attachments,
  };

  // Actually save the diary to the in-memory store
  siteDiaries.push(newDiary);

  return newDiary;
}
