import { cn } from '@/lib/utils';
import * as React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

/**
 * Standard page container component with mobile-first responsive padding
 * and consistent max-width constraints.
 *
 * Default maxWidth is '4xl' for comfortable reading width.
 * Use '7xl' for list/grid views that need more space.
 * Use '2xl' for form pages that need narrow focus.
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <h1>My Page</h1>
 * </PageContainer>
 * ```
 */
export function PageContainer({
  children,
  className,
  maxWidth = '4xl',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto',
        // Mobile-first responsive padding
        'px-4 py-6',
        'sm:px-6 sm:py-8',
        'lg:px-8 lg:py-10',
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
