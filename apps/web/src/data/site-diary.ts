import type { Int } from 'grats';

/** @gqlType */
export type Weather = {
  /** @gqlField */
  temperature: Int;
  /** @gqlField */
  description: string;
};

/** @gqlType */
export type SiteDiary = {
  /** @gqlField */
  id: string;
  /** @gqlField */
  date: string;
  /** @gqlField */
  weather?: Weather;
  /** @gqlField */
  createdBy: string;
  /** @gqlField */
  title: string;
  /** @gqlField */
  content?: string;
  /** @gqlField */
  attendees?: string[];
  /** @gqlField */
  attachments?: string[];
};

export const siteDiaries: SiteDiary[] = [
  {
    id: 'cm4lvx1rf00006fujdr7w5u9h',
    date: '2024-12-13',
    weather: {
      temperature: 20,
      description: 'sunny',
    },
    createdBy: 'John Doe',
    title: 'Test',
    content: 'Site diary entry to discuss the activities of the day',
    attendees: ['Jane Smith', 'John Doe'],
    attachments: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00007fujdr7w5u9i',
    date: '2024-12-12',
    weather: {
      temperature: 18,
      description: 'cloudy',
    },
    createdBy: 'Jane Smith',
    title: 'Progress Meeting',
    content: 'Detailed discussion on project milestones',
    attendees: ['John Doe', 'Mary Johnson'],
    attachments: [
      'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00008fujdr7w5u9j',
    date: '2024-12-11',
    weather: {
      temperature: 22,
      description: 'partly cloudy',
    },
    createdBy: 'Mary Johnson',
    title: 'Inspection Report',
    content: 'Inspection of the northern site completed',
    attendees: ['Jane Smith', 'Robert Brown'],
    attachments: [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00009fujdr7w5u9k',
    date: '2024-12-10',
    weather: {
      temperature: 16,
      description: 'rainy',
    },
    createdBy: 'Robert Brown',
    title: 'Safety Check',
    content: 'Conducted safety checks on all equipment',
    attendees: ['John Doe', 'Mary Johnson'],
    attachments: [],
  },
  {
    id: 'cm4lvx1rf00010fujdr7w5u9l',
    date: '2024-12-09',
    weather: {
      temperature: 19,
      description: 'windy',
    },
    createdBy: 'Jane Smith',
    title: 'Weekly Summary',
    content: 'Summarised the weekly progress on the project',
    attendees: ['Jane Smith', 'Robert Brown', 'Mary Johnson'],
    attachments: [
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
];
