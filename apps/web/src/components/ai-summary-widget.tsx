'use client';

import { cn } from '@/lib/utils';
import type { AiSummaryResult } from '@/types/__generated__/graphql';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type DateRangeOption = 'recent7' | 'recent15' | 'week' | 'month';

const DATE_RANGE_OPTIONS: Array<{ value: DateRangeOption; label: string }> = [
  { value: 'recent7', label: '📌 Recent 7' },
  { value: 'recent15', label: '📌 Recent 15' },
  { value: 'week', label: '📅 Last 7 Days' },
  { value: 'month', label: '📅 Last 30 Days' },
];

const RATE_LIMIT_PATTERN = /wait (\d+) seconds/;
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred.';

type SummaryErrorType =
  | 'RATE_LIMIT'
  | 'API_KEY_MISSING'
  | 'API_KEY_INVALID'
  | 'SERVICE_UNAVAILABLE'
  | 'GENERIC';

const ERROR_TITLES: Record<SummaryErrorType, string> = {
  RATE_LIMIT: 'Rate Limit Exceeded',
  API_KEY_MISSING: 'API Key Not Configured',
  API_KEY_INVALID: 'Invalid API Key',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  GENERIC: 'Failed to Generate Summary',
};

type GraphQLErrorExtensions = {
  code?: string;
  details?: unknown;
};

type GraphQLLikeError = {
  message?: string;
  extensions?: GraphQLErrorExtensions;
};

type MutationErrorShape = {
  graphQLErrors?: GraphQLLikeError[];
  message?: string;
  networkError?: {
    message?: string;
  } | null;
};

type ExtractedErrorInfo = {
  message: string;
  code?: string;
  details?: unknown;
};

function extractErrorInfo(
  error?: MutationErrorShape | null,
): ExtractedErrorInfo {
  if (!error) {
    return { message: DEFAULT_ERROR_MESSAGE };
  }

  const firstGraphQLError = error.graphQLErrors?.find((graphQLError) => {
    return typeof graphQLError?.message === 'string';
  });

  if (firstGraphQLError) {
    const extensions = firstGraphQLError.extensions;

    return {
      message: firstGraphQLError.message ?? DEFAULT_ERROR_MESSAGE,
      code: typeof extensions?.code === 'string' ? extensions.code : undefined,
      details: extensions?.details,
    };
  }

  const networkMessage = error.networkError?.message;

  return {
    message: error.message || networkMessage || DEFAULT_ERROR_MESSAGE,
  };
}

function getErrorType(
  errorMessage: string,
  errorCode?: string,
): SummaryErrorType {
  switch (errorCode) {
    case 'RATE_LIMIT_EXCEEDED':
    case 'OPENAI_PROVIDER_RATE_LIMIT':
      return 'RATE_LIMIT';
    case 'OPENAI_NOT_CONFIGURED':
      return 'API_KEY_MISSING';
    case 'OPENAI_UNAUTHORIZED':
      return 'API_KEY_INVALID';
    case 'OPENAI_SERVICE_UNAVAILABLE':
      return 'SERVICE_UNAVAILABLE';
    default:
      break;
  }

  const normalized = errorMessage.toLowerCase();

  if (normalized.includes('rate limit')) {
    return 'RATE_LIMIT';
  }

  if (normalized.includes('not configured')) {
    return 'API_KEY_MISSING';
  }

  if (normalized.includes('invalid openai')) {
    return 'API_KEY_INVALID';
  }

  if (normalized.includes('unavailable')) {
    return 'SERVICE_UNAVAILABLE';
  }

  return 'GENERIC';
}

function getWaitTimeSeconds(
  details: unknown,
  errorMessage: string,
): number | null {
  if (details && typeof details === 'object' && 'waitTimeSeconds' in details) {
    const value = (details as { waitTimeSeconds?: unknown }).waitTimeSeconds;

    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.max(0, Math.floor(value));
    }
  }

  const match = RATE_LIMIT_PATTERN.exec(errorMessage);

  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[1] ?? '', 10);

  return Number.isFinite(parsed) ? parsed : null;
}

const getErrorTitle = (errorType: SummaryErrorType) => {
  return ERROR_TITLES[errorType];
};

type SummarizeMutationData = {
  summarizeSiteDiaries: AiSummaryResult;
};

type SummarizeMutationVariables = {
  startDate: string;
  endDate: string;
  limit?: number | null;
};

const SUMMARIZE_DIARIES = gql`
  mutation SummarizeDiaries(
    $startDate: String!
    $endDate: String!
    $limit: Int
  ) {
    summarizeSiteDiaries(
      startDate: $startDate
      endDate: $endDate
      limit: $limit
    ) {
      summary
      diariesCount
      startDate
      endDate
    }
  }
`;

interface AISummaryWidgetProps {
  className?: string;
}

export function AISummaryWidget({ className }: AISummaryWidgetProps) {
  const [summarize, { loading, data, error, reset }] = useMutation<
    SummarizeMutationData,
    SummarizeMutationVariables
  >(SUMMARIZE_DIARIES);
  const [dateRange, setDateRange] = useState<DateRangeOption>('recent7');
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const handleDateRangeChange = (newRange: DateRangeOption) => {
    setDateRange(newRange);
    setRemainingSeconds(null);
    reset(); // Clear previous data to show the generate button
  };

  // Extract wait time from error message
  useEffect(() => {
    if (!error) {
      return;
    }

    const { message: errorMessage, code, details } = extractErrorInfo(error);
    if (getErrorType(errorMessage, code) !== 'RATE_LIMIT') {
      return;
    }

    const nextSeconds = getWaitTimeSeconds(details, errorMessage);

    const timer = window.setTimeout(() => {
      setRemainingSeconds(nextSeconds);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [error]);

  // Countdown timer
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  /**
   * Extract error message from Apollo Client error object
   * With maskedErrors: false in GraphQL Yoga, error messages are directly available
   */
  /**
   * Generate AI summary based on selected date range or entry limit
   */
  const generateSummary = () => {
    setRemainingSeconds(null);
    const endDate = new Date().toISOString().split('T')[0];

    if (dateRange === 'recent7' || dateRange === 'recent15') {
      // Recent entries mode: use limit parameter
      const limit = dateRange === 'recent7' ? 7 : 15;
      const startDate = '2000-01-01'; // Wide range to catch all entries

      summarize({ variables: { startDate, endDate, limit } });
    } else {
      // Date range mode: last 7 or 30 days
      const daysAgo = dateRange === 'week' ? 7 : 30;
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      summarize({ variables: { startDate, endDate, limit: null } });
    }
  };

  return (
    <div className={className}>
      <div className="from-primary/5 to-primary/10 border-primary/20 rounded-lg border bg-gradient-to-br p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-lg font-semibold">AI Summary</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Generate intelligent summaries of site diaries
              </p>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap gap-2">
            {DATE_RANGE_OPTIONS.map(({ value, label }) => {
              const isActive = dateRange === value;

              return (
                <button
                  key={value}
                  onClick={() => handleDateRangeChange(value)}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        {!data && !error && (
          <button
            onClick={generateSummary}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full cursor-pointer rounded-md px-4 py-2.5 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating AI Summary...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                Generate{' '}
                {dateRange === 'recent7'
                  ? 'Summary (7 Entries)'
                  : dateRange === 'recent15'
                    ? 'Summary (15 Entries)'
                    : dateRange === 'week'
                      ? 'Weekly Summary'
                      : 'Monthly Summary'}
              </span>
            )}
          </button>
        )}

        {/* Error State */}
        {error &&
          (() => {
            const {
              message: errorMessage,
              code,
              details,
            } = extractErrorInfo(error);
            const errorType = getErrorType(errorMessage, code);
            const errorTitle = getErrorTitle(errorType);
            const derivedWaitSeconds = getWaitTimeSeconds(
              details,
              errorMessage,
            );
            const displaySeconds =
              errorType === 'RATE_LIMIT'
                ? (remainingSeconds ?? derivedWaitSeconds)
                : null;
            const helpText =
              details &&
              typeof details === 'object' &&
              details !== null &&
              'helpText' in details &&
              typeof (details as { helpText?: unknown }).helpText === 'string'
                ? (details as { helpText: string }).helpText
                : null;

            return (
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-4">
                {/* Error Header */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-destructive text-lg">⚠️</span>
                  <p className="text-destructive font-medium">{errorTitle}</p>
                </div>

                {/* Error Message with Countdown for Rate Limits */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {errorType === 'RATE_LIMIT' && displaySeconds !== null ? (
                    <>
                      Rate limit exceeded. Please wait{' '}
                      <strong className="text-destructive">
                        {displaySeconds}
                      </strong>{' '}
                      {displaySeconds === 1 ? 'second' : 'seconds'} before
                      trying again. (Max 2 requests per minute)
                    </>
                  ) : (
                    errorMessage
                  )}
                </p>

                {/* Contextual Help Messages */}
                {errorType === 'RATE_LIMIT' && (
                  <div className="bg-muted/50 mt-3 rounded-md p-3">
                    <p className="text-muted-foreground text-xs">
                      💡 This is a <strong>global rate limit</strong> that
                      applies to all users of this demo. Please wait and try
                      again, or select a different time period using the buttons
                      above.
                    </p>
                  </div>
                )}

                {errorType === 'API_KEY_MISSING' && (
                  <div className="bg-muted/50 mt-3 rounded-md p-3">
                    <p className="text-muted-foreground text-xs">
                      🔑 The OpenAI API key needs to be added to the{' '}
                      <code className="bg-muted rounded px-1">.env</code> file.
                      Contact your administrator for setup assistance.
                    </p>
                  </div>
                )}

                {errorType === 'SERVICE_UNAVAILABLE' && (
                  <div className="bg-muted/50 mt-3 rounded-md p-3">
                    <p className="text-muted-foreground text-xs">
                      🔧 The OpenAI service is experiencing issues. This is
                      temporary - please try again in a few moments.
                    </p>
                  </div>
                )}

                {helpText && (
                  <div className="bg-muted/50 mt-3 rounded-md p-3">
                    <p className="text-muted-foreground text-xs">{helpText}</p>
                  </div>
                )}

                {/* Try Again Button (conditional based on error type) */}
                {errorType === 'RATE_LIMIT' ? (
                  // Only show when countdown reaches 0
                  remainingSeconds === 0 && (
                    <button
                      onClick={() => {
                        reset();
                        setRemainingSeconds(null);
                        generateSummary();
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground mt-3 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                      ✨ Try Again Now
                    </button>
                  )
                ) : errorType !== 'API_KEY_MISSING' ? (
                  // Show immediately for other errors (except missing API key)
                  <button
                    onClick={generateSummary}
                    className="text-primary hover:text-primary/80 mt-3 cursor-pointer text-sm font-medium underline"
                  >
                    Try again
                  </button>
                ) : null}
              </div>
            );
          })()}

        {/* Success State - Summary Display */}
        {data && (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="bg-background/50 flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-muted-foreground text-xs">Period</p>
                <p className="text-sm font-medium">
                  {new Date(
                    data.summarizeSiteDiaries.startDate,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    data.summarizeSiteDiaries.endDate,
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Entries</p>
                <p className="text-primary text-2xl font-bold">
                  {data.summarizeSiteDiaries.diariesCount}
                </p>
              </div>
            </div>

            {/* AI Generated Summary */}
            <div className="bg-background rounded-md border p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-primary text-lg">
                  {data.summarizeSiteDiaries.diariesCount === 0 ? '💡' : '📝'}
                </span>
                <p className="text-base font-semibold">
                  {data.summarizeSiteDiaries.diariesCount === 0
                    ? 'No Entries Found'
                    : 'AI-Generated Summary'}
                </p>
              </div>
              <div className="prose prose-sm max-w-none">
                {data.summarizeSiteDiaries.summary
                  .split('\n')
                  .map((line: string, idx: number) => {
                    // Handle emoji section headers (e.g., 📊 OVERVIEW)
                    if (line.match(/^[📊🔨🌤️⚠️👥]/)) {
                      return (
                        <h3
                          key={idx}
                          className="text-foreground mt-4 mb-2 flex items-center gap-2 text-sm font-semibold first:mt-0"
                        >
                          {line}
                        </h3>
                      );
                    }
                    // Handle bullet points
                    if (line.trim().startsWith('•')) {
                      return (
                        <li
                          key={idx}
                          className="text-muted-foreground ml-4 list-none text-sm leading-relaxed"
                        >
                          {line.trim().substring(1).trim()}
                        </li>
                      );
                    }
                    // Handle regular paragraphs
                    if (line.trim()) {
                      return (
                        <p
                          key={idx}
                          className="text-muted-foreground mb-2 text-sm leading-relaxed"
                        >
                          {line}
                        </p>
                      );
                    }
                    // Empty line for spacing
                    return <div key={idx} className="h-2" />;
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              {data.summarizeSiteDiaries.diariesCount === 0 ? (
                <Link
                  href="/diary"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-center text-sm font-medium transition-colors"
                >
                  ➕ Create Diary Entry
                </Link>
              ) : (
                <>
                  <button
                    onClick={generateSummary}
                    className="hover:bg-muted bg-background flex-1 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                  >
                    🔄 Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        data.summarizeSiteDiaries.summary,
                      );
                    }}
                    className="hover:bg-muted bg-background flex-1 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                  >
                    📋 Copy to Clipboard
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Info Notice */}
        {!data && !loading && !error && (
          <div className="bg-muted/50 mt-4 rounded-md border p-3">
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              💡 Choose your summary type:
            </p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>
                <strong>📌 Recent:</strong> Summarize your most recent entries
                (works with any dates)
              </li>
              <li>
                <strong>📅 Date Range:</strong> Summarize entries within
                specific date ranges
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
