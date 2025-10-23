import { siteDiaries, type SiteDiary } from '@/data/site-diary';

export type DiarySummarySelection = {
  startDate: string;
  endDate: string;
  limit?: number | null | undefined;
};

export type DiarySummarySelectionResult = {
  diaries: SiteDiary[];
  startDate: string;
  endDate: string;
};

const isPositiveInteger = (value: number) => {
  return Number.isFinite(value) && Number.isInteger(value) && value > 0;
};

export function selectDiariesForSummary(
  selection: DiarySummarySelection,
): DiarySummarySelectionResult {
  const { startDate, endDate, limit } = selection;
  const normalizedLimit =
    typeof limit === 'number' && isPositiveInteger(limit) ? limit : null;

  if (normalizedLimit) {
    const sortedDescending = [...siteDiaries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const diaries = sortedDescending.slice(0, normalizedLimit);

    if (diaries.length === 0) {
      return {
        diaries,
        startDate,
        endDate,
      };
    }

    return {
      diaries,
      startDate: diaries[diaries.length - 1]?.date ?? startDate,
      endDate: diaries[0]?.date ?? endDate,
    };
  }

  const diaries = siteDiaries.filter((diary) => {
    return diary.date >= startDate && diary.date <= endDate;
  });

  return {
    diaries,
    startDate,
    endDate,
  };
}

export function buildEmptySummaryMessage({
  startDate,
  endDate,
  limit,
}: DiarySummarySelectionResult & {
  limit?: number | null | undefined;
}): string {
  const rangeText = limit
    ? `searched the most recent ${limit} entr${limit === 1 ? 'y' : 'ies'}`
    : `searched between ${new Date(startDate).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}`;

  return `No site diary entries were found (${rangeText}).\n\nTo generate a summary, try these steps:\n• Create new diary entries for the period\n• Use the "Recent Entries" options to review the latest activity\n• Confirm diary entries exist in the Diary section\n\nOnce diary entries are available, the AI will generate insights covering weather conditions, team activities, safety observations, and progress updates.`;
}
