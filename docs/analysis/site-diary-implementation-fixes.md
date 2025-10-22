# Site Diary Implementation Fixes & Improvements

**Document Type**: Technical Implementation Guide  
**Date**: October 22, 2025  
**Purpose**: Specific code changes to address critical issues while preserving existing behavior  
**Scope**: Bug fixes, enhancements, and missing feature implementations

## Overview

This document provides specific, actionable fixes for the Site Diary implementation. All proposed changes maintain backward compatibility and existing behavior unless explicitly correcting bugs.

## 1. Critical Bug Fixes

### 1.1 Fix GraphQL Mutation Data Persistence

**Issue**: The `createSiteDiary` mutation doesn't actually save data - it just returns the input.

**Current Code** (`apps/web/src/app/api/graphql/mutation.ts`):

```typescript
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  return input; // BUG: This doesn't save anything!
}
```

**Fixed Implementation**:

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';
import { nanoid } from 'nanoid';

/** @gqlInput */
interface SiteDiaryInput {
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}

/** @gqlInput */
interface WeatherInput {
  temperature: number;
  description: string;
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  const newDiary: SiteDiary = {
    id: input.id || nanoid(), // Generate ID if not provided
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather,
    attendees: input.attendees,
    attachments: input.attachments,
  };

  // Actually save to the in-memory store
  siteDiaries.push(newDiary);

  return newDiary;
}

/** @gqlMutationField */
export function updateSiteDiary(
  id: string,
  input: Partial<SiteDiaryInput>,
): SiteDiary | null {
  const index = siteDiaries.findIndex((diary) => diary.id === id);
  if (index === -1) return null;

  const updatedDiary = { ...siteDiaries[index], ...input };
  siteDiaries[index] = updatedDiary;

  return updatedDiary;
}

/** @gqlMutationField */
export function deleteSiteDiary(id: string): boolean {
  const index = siteDiaries.findIndex((diary) => diary.id === id);
  if (index === -1) return false;

  siteDiaries.splice(index, 1);
  return true;
}
```

### 1.2 Fix REST API Data Persistence

**Issue**: The POST endpoint validates but doesn't save data.

**Current Code** (`apps/web/src/app/api/site-diary/route.ts`):

```typescript
export async function POST(request: NextRequest) {
  // ... validation ...
  return NextResponse.json(
    { message: 'Site diary created successfully', siteDiary },
    { status: 201 },
  ); // BUG: Doesn't actually save the diary!
}
```

**Fixed Implementation**:

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Validate required fields
    if (!siteDiary.date || !siteDiary.createdBy || !siteDiary.title) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: 'date, createdBy and title are required',
        },
        { status: 400 },
      );
    }

    // Create complete diary entry
    const newDiary: SiteDiary = {
      id: siteDiary.id || nanoid(),
      date: siteDiary.date,
      createdBy: siteDiary.createdBy,
      title: siteDiary.title,
      content: siteDiary.content,
      weather: siteDiary.weather,
      attendees: siteDiary.attendees,
      attachments: siteDiary.attachments,
    };

    // Actually save to the store
    siteDiaries.push(newDiary);

    return NextResponse.json(
      { message: 'Site diary created successfully', siteDiary: newDiary },
      { status: 201 },
    );
  } catch (e: unknown) {
    let errorMessage = 'Unknown error';
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    return NextResponse.json(
      { error: 'Invalid request format', details: errorMessage },
      { status: 400 },
    );
  }
}

// Add UPDATE and DELETE endpoints
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 },
      );
    }

    const updates = await request.json();
    const index = siteDiaries.findIndex((diary) => diary.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Diary entry not found' },
        { status: 404 },
      );
    }

    siteDiaries[index] = { ...siteDiaries[index], ...updates };

    return NextResponse.json(
      {
        message: 'Site diary updated successfully',
        siteDiary: siteDiaries[index],
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: 'Update failed', details: (e as Error).message },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 },
      );
    }

    const index = siteDiaries.findIndex((diary) => diary.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Diary entry not found' },
        { status: 404 },
      );
    }

    siteDiaries.splice(index, 1);

    return NextResponse.json(
      { message: 'Site diary deleted successfully' },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: 'Delete failed', details: (e as Error).message },
      { status: 400 },
    );
  }
}
```

### 1.3 Fix GraphQL Input Type Incompleteness

**Issue**: The `SiteDiaryInput` type is missing optional fields that exist in the `SiteDiary` type.

**Fixed Type Definition**:

```typescript
/** @gqlInput */
interface SiteDiaryInput {
  id?: string; // Optional - will be generated if not provided
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}

/** @gqlInput */
interface WeatherInput {
  temperature: number;
  description: string;
}
```

## 2. Enhanced Query Capabilities

### 2.1 Add Filtering and Pagination Support

**Enhanced Query Implementation**:

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';

/** @gqlInput */
interface SiteDiaryFilter {
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  title?: string;
}

/** @gqlInput */
interface PaginationInput {
  limit?: number;
  offset?: number;
}

/** @gqlQueryField */
export function siteDiaries(
  filter?: SiteDiaryFilter,
  pagination?: PaginationInput,
): Array<SiteDiary> {
  let filtered = [...siteDiaries];

  // Apply filters
  if (filter) {
    if (filter.dateFrom) {
      filtered = filtered.filter((diary) => diary.date >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      filtered = filtered.filter((diary) => diary.date <= filter.dateTo!);
    }
    if (filter.createdBy) {
      filtered = filtered.filter((diary) =>
        diary.createdBy.toLowerCase().includes(filter.createdBy!.toLowerCase()),
      );
    }
    if (filter.title) {
      filtered = filtered.filter((diary) =>
        diary.title.toLowerCase().includes(filter.title!.toLowerCase()),
      );
    }
  }

  // Sort by date (most recent first)
  filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Apply pagination
  if (pagination) {
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;
    filtered = filtered.slice(offset, offset + limit);
  }

  return filtered;
}

/** @gqlQueryField */
export function siteDiariesByDateRange(
  startDate: string,
  endDate: string,
): Array<SiteDiary> {
  return siteDiaries.filter(
    (diary) => diary.date >= startDate && diary.date <= endDate,
  );
}

/** @gqlQueryField */
export function siteDiariesCount(filter?: SiteDiaryFilter): number {
  // Reuse filtering logic but return count
  const filtered = siteDiaries(filter);
  return filtered.length;
}
```

## 3. Input Validation Enhancements

### 3.1 Comprehensive Validation Utils

**Create new file**: `apps/web/src/lib/validation.ts`

```typescript
import { z } from 'zod';

// Weather validation schema
export const weatherSchema = z.object({
  temperature: z.number().min(-50).max(60).describe('Temperature in Celsius'),
  description: z
    .enum([
      'sunny',
      'cloudy',
      'partly cloudy',
      'rainy',
      'stormy',
      'windy',
      'foggy',
      'snowy',
    ])
    .describe('Weather condition'),
});

// Site diary validation schema
export const siteDiarySchema = z.object({
  id: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  createdBy: z.string().min(1, 'Creator name is required').max(100),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(5000).optional(),
  weather: weatherSchema.optional(),
  attendees: z.array(z.string().max(100)).max(50).optional(),
  attachments: z.array(z.string().url()).max(20).optional(),
});

export type SiteDiaryValidationError = {
  field: string;
  message: string;
};

export function validateSiteDiary(input: unknown): {
  success: boolean;
  data?: any;
  errors?: SiteDiaryValidationError[];
} {
  try {
    const result = siteDiarySchema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
}
```

### 3.2 Apply Validation to Mutations

**Enhanced Mutation with Validation**:

```typescript
import { validateSiteDiary } from '@/lib/validation';

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  // Validate input
  const validation = validateSiteDiary(input);
  if (!validation.success) {
    throw new Error(
      `Validation failed: ${validation.errors?.map((e) => e.message).join(', ')}`,
    );
  }

  const newDiary: SiteDiary = {
    id: input.id || nanoid(),
    date: input.date,
    createdBy: input.createdBy,
    title: input.title,
    content: input.content,
    weather: input.weather,
    attendees: input.attendees || [],
    attachments: input.attachments || [],
  };

  siteDiaries.push(newDiary);
  return newDiary;
}
```

## 4. Frontend Component Implementations

### 4.1 Site Diary List Component

**Create new file**: `apps/web/src/components/site-diary/diary-list.tsx`

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_DIARIES } from '@/graphql/queries';
import { SiteDiariesQuery } from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import Link from 'next/link';

export const DiaryList: React.FC = () => {
  const { data } = useSuspenseQuery<SiteDiariesQuery>(SITE_DIARIES);

  if (!data.siteDiaries?.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No diary entries found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.siteDiaries.map((diary) => (
        <Link key={diary.id} href={`/diary/${diary.id}`}>
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{diary.title}</CardTitle>
                {diary.weather && (
                  <Badge variant="secondary">
                    {diary.weather.temperature}°C {diary.weather.description}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {new Date(diary.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-sm">
                Created by: {diary.createdBy}
              </p>
              {diary.content && (
                <p className="line-clamp-3 text-sm">{diary.content}</p>
              )}
              {diary.attendees && diary.attendees.length > 0 && (
                <div className="mt-2">
                  <p className="text-muted-foreground text-xs">
                    {diary.attendees.length} attendee(s)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
```

### 4.2 Site Diary Detail Component

**Create new file**: `apps/web/src/components/site-diary/diary-detail.tsx`

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_DIARY } from '@/graphql/queries';
import {
  SiteDiaryQuery,
  SiteDiaryQueryVariables,
} from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { Calendar, Image as ImageIcon, User, Users } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Diary entry not found.</p>
      </div>
    );
  }

  const { siteDiary: diary } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{diary.title}</CardTitle>
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(diary.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {diary.createdBy}
            </div>
            {diary.weather && (
              <Badge variant="secondary">
                {diary.weather.temperature}°C {diary.weather.description}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {diary.content && (
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="whitespace-pre-wrap">{diary.content}</p>
            </div>
          )}

          {diary.attendees && diary.attendees.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4" />
                Attendees ({diary.attendees.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {diary.attendees.map((attendee, index) => (
                  <Badge key={index} variant="outline">
                    {attendee}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {diary.attachments && diary.attachments.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <ImageIcon className="h-4 w-4" />
                Attachments ({diary.attachments.length})
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {diary.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={attachment}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
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
```

### 4.3 Enhanced GraphQL Queries

**Update file**: `apps/web/src/graphql/queries.ts`

```typescript
import { gql } from '@apollo/client';

export const SITE_DIARIES = gql`
  query SiteDiaries($filter: SiteDiaryFilter, $pagination: PaginationInput) {
    siteDiaries(filter: $filter, pagination: $pagination) {
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

export const SITE_DIARY = gql`
  query SiteDiary($id: String!) {
    siteDiary(id: $id) {
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

export const CREATE_SITE_DIARY = gql`
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

export const UPDATE_SITE_DIARY = gql`
  mutation UpdateSiteDiary($id: String!, $input: SiteDiaryInput!) {
    updateSiteDiary(id: $id, input: $input) {
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

export const DELETE_SITE_DIARY = gql`
  mutation DeleteSiteDiary($id: String!) {
    deleteSiteDiary(id: $id)
  }
`;
```

## 5. Mobile App Enhancements

### 5.1 Enhanced Mobile List Component

**Update file**: `apps/mobile/src/app/(tabs)/(home)/index.tsx`

```tsx
import { Text } from '@/components/ui/text.tsx';
import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/compiled';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
      date
      createdBy
      weather {
        temperature
        description
      }
      attendees
    }
  }
`;

const IndexScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const navigateToDetail = (id: string) => {
    router.push(`/diary/${id}`);
  };

  const navigateToCreate = () => {
    router.push('/diary/create');
  };

  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center">Loading diary entries...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={true}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1 gap-4 p-4">
        <TouchableOpacity
          onPress={navigateToCreate}
          className="mb-4 rounded-lg bg-blue-500 p-4"
        >
          <Text className="text-center font-semibold text-white">
            Create New Entry
          </Text>
        </TouchableOpacity>

        {!data?.siteDiaries?.length ? (
          <View className="items-center justify-center py-12">
            <Text className="text-center text-gray-500">
              No diary entries found.
            </Text>
          </View>
        ) : (
          data.siteDiaries.map((diary) => (
            <TouchableOpacity
              key={diary.id}
              onPress={() => navigateToDetail(diary.id)}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <View className="mb-2 flex-row items-start justify-between">
                <Text className="flex-1 text-lg font-semibold">
                  {diary.title}
                </Text>
                {diary.weather && (
                  <View className="rounded bg-gray-100 px-2 py-1">
                    <Text className="text-xs text-gray-600">
                      {diary.weather.temperature}°C
                    </Text>
                  </View>
                )}
              </View>

              <Text className="mb-1 text-sm text-gray-600">
                {new Date(diary.date).toLocaleDateString()}
              </Text>

              <Text className="text-sm text-gray-500">
                By: {diary.createdBy}
              </Text>

              {diary.attendees && diary.attendees.length > 0 && (
                <Text className="mt-1 text-xs text-gray-500">
                  {diary.attendees.length} attendee(s)
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

IndexScreen.displayName = 'IndexScreen';

export default IndexScreen;
```

## 6. Error Handling Improvements

### 6.1 GraphQL Error Handling

**Create new file**: `apps/web/src/lib/error-handling.ts`

```typescript
import { GraphQLError } from 'graphql';

export class ValidationError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: 'VALIDATION_ERROR',
        field,
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, {
      extensions: {
        code: 'NOT_FOUND',
        resource,
        id,
      },
    });
  }
}

export function handleMutationError(error: unknown): GraphQLError {
  if (error instanceof GraphQLError) {
    return error;
  }

  if (error instanceof Error) {
    return new GraphQLError(error.message);
  }

  return new GraphQLError('An unexpected error occurred');
}
```

### 6.2 Apply Error Handling to Mutations

**Enhanced Mutation with Error Handling**:

```typescript
import {
  handleMutationError,
  NotFoundError,
  ValidationError,
} from '@/lib/error-handling';

/** @gqlMutationField */
export function updateSiteDiary(
  id: string,
  input: Partial<SiteDiaryInput>,
): SiteDiary {
  try {
    const index = siteDiaries.findIndex((diary) => diary.id === id);
    if (index === -1) {
      throw new NotFoundError('SiteDiary', id);
    }

    // Validate partial update
    const validation = validateSiteDiary({ ...siteDiaries[index], ...input });
    if (!validation.success) {
      throw new ValidationError(
        `Validation failed: ${validation.errors?.map((e) => e.message).join(', ')}`,
      );
    }

    const updatedDiary = { ...siteDiaries[index], ...input };
    siteDiaries[index] = updatedDiary;

    return updatedDiary;
  } catch (error) {
    throw handleMutationError(error);
  }
}

/** @gqlMutationField */
export function deleteSiteDiary(id: string): boolean {
  try {
    const index = siteDiaries.findIndex((diary) => diary.id === id);
    if (index === -1) {
      throw new NotFoundError('SiteDiary', id);
    }

    siteDiaries.splice(index, 1);
    return true;
  } catch (error) {
    throw handleMutationError(error);
  }
}
```

## 7. Performance Optimizations

### 7.1 Query Optimization with DataLoader Pattern

**Create new file**: `apps/web/src/lib/data-loaders.ts`

```typescript
import { siteDiaries, SiteDiary } from '@/data/site-diary';
import DataLoader from 'dataloader';

// Batch load site diaries by IDs
const siteDiaryLoader = new DataLoader<string, SiteDiary | undefined>(
  async (ids: readonly string[]) => {
    return ids.map((id) => siteDiaries.find((diary) => diary.id === id));
  },
);

export { siteDiaryLoader };
```

### 7.2 Implement Caching Headers

**Enhanced REST API with Caching**:

```typescript
export async function GET() {
  const diaries = siteDiaries.map((entry) => ({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    createdBy: entry.createdBy,
  }));

  return NextResponse.json(diaries, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
```

## 8. Package Dependencies

### 8.1 Required Dependencies to Add

**For Web App** (`apps/web/package.json`):

```json
{
  "dependencies": {
    "nanoid": "^5.0.4",
    "zod": "^3.22.4",
    "dataloader": "^2.2.2",
    "lucide-react": "^0.294.0"
  }
}
```

**For Mobile App** (`apps/mobile/package.json`):

```json
{
  "dependencies": {
    "expo-router": "^3.5.23"
  }
}
```

## 9. Testing Implementations

### 9.1 Unit Tests for Mutations

**Create new file**: `apps/web/src/__tests__/mutations.test.ts`

```typescript
import {
  createSiteDiary,
  deleteSiteDiary,
  updateSiteDiary,
} from '@/app/api/graphql/mutation';
import { siteDiaries } from '@/data/site-diary';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123',
}));

describe('Site Diary Mutations', () => {
  beforeEach(() => {
    // Reset the in-memory store
    siteDiaries.length = 0;
  });

  describe('createSiteDiary', () => {
    it('should create a new diary entry', () => {
      const input = {
        date: '2024-12-13',
        createdBy: 'Test User',
        title: 'Test Entry',
        content: 'Test content',
      };

      const result = createSiteDiary(input);

      expect(result).toMatchObject(input);
      expect(result.id).toBe('test-id-123');
      expect(siteDiaries).toHaveLength(1);
    });

    it('should throw validation error for invalid input', () => {
      const input = {
        date: 'invalid-date',
        createdBy: '',
        title: '',
      };

      expect(() => createSiteDiary(input)).toThrow('Validation failed');
    });
  });

  describe('updateSiteDiary', () => {
    it('should update existing diary entry', () => {
      // Create initial entry
      const created = createSiteDiary({
        date: '2024-12-13',
        createdBy: 'Test User',
        title: 'Original Title',
      });

      // Update the entry
      const updated = updateSiteDiary(created.id, {
        title: 'Updated Title',
      });

      expect(updated?.title).toBe('Updated Title');
      expect(updated?.createdBy).toBe('Test User'); // Should preserve other fields
    });

    it('should return null for non-existent entry', () => {
      const result = updateSiteDiary('non-existent-id', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('deleteSiteDiary', () => {
    it('should delete existing diary entry', () => {
      // Create initial entry
      const created = createSiteDiary({
        date: '2024-12-13',
        createdBy: 'Test User',
        title: 'To Delete',
      });

      const result = deleteSiteDiary(created.id);

      expect(result).toBe(true);
      expect(siteDiaries).toHaveLength(0);
    });

    it('should return false for non-existent entry', () => {
      const result = deleteSiteDiary('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
```

## 10. Implementation Order & Deployment

### 10.1 Recommended Implementation Order

1. **Phase 1 - Critical Fixes**:
   - Fix GraphQL mutation data persistence
   - Fix REST API data persistence
   - Add proper input validation
   - Enhance GraphQL schema with missing fields

2. **Phase 2 - Core Features**:
   - Implement list and detail components
   - Add CRUD operations UI
   - Implement mobile-responsive design
   - Add error handling and loading states

3. **Phase 3 - Enhancements**:
   - Add filtering and pagination
   - Implement image upload functionality
   - Add comprehensive testing
   - Performance optimizations

### 10.2 Backward Compatibility Notes

All proposed changes maintain backward compatibility:

- Existing API endpoints continue to work
- GraphQL schema is additive (no breaking changes)
- New optional fields don't affect existing clients
- Enhanced validation provides better error messages

### 10.3 Configuration Changes Required

**Environment Variables** (add to `.env.local`):

```env
# Image upload service (when implemented)
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3000/api/upload
```

**Package Installation Commands**:

```bash
# Web app dependencies
cd apps/web && npm install nanoid zod dataloader lucide-react

# Mobile app dependencies
cd apps/mobile && npm install expo-router

# Install testing dependencies
npm install --save-dev jest @types/jest
```

The implementation of these fixes addresses the critical issues identified in the main analysis document while maintaining the existing architecture and ensuring no breaking changes to current functionality.
