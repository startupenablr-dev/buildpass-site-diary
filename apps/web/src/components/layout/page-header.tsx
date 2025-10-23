import { cn } from '@/lib/utils';
import * as React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standard page header component with title, optional description,
 * and action buttons. Responsive layout stacks on mobile.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Site Diaries"
 *   description="View all site diary entries"
 *   actions={
 *     <Button asChild>
 *       <Link href="/diary/create">Create Entry</Link>
 *     </Button>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 sm:mb-8',
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
