import { siteDiaries as rawSiteDiaries, SiteDiary } from '@/data/site-diary';

/** @gqlQueryField */
export function siteDiaries(): Array<SiteDiary> {
  return rawSiteDiaries;
}

/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary | undefined {
  return rawSiteDiaries.find((entry) => entry.id === id);
}

/**
 * Get site diaries within a date range
 * @gqlQueryField
 */
export function siteDiariesByDateRange(
  startDate: string,
  endDate: string,
): Array<SiteDiary> {
  return rawSiteDiaries.filter((diary) => {
    return diary.date >= startDate && diary.date <= endDate;
  });
}
