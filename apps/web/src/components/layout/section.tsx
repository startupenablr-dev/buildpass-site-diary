import { cn } from '@/lib/utils';
import * as React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Section component for organizing content with optional title.
 * Provides consistent spacing and layout.
 *
 * @example
 * ```tsx
 * <Section title="Recent Entries" description="Last 7 days">
 *   <DiaryList />
 * </Section>
 * ```
 */
export function Section({
  children,
  className,
  title,
  description,
}: SectionProps) {
  return (
    <section className={cn('space-y-4 sm:space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
