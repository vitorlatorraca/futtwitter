import { cn } from '@/lib/utils';
import { formatRating, getRatingPillClass, isValidRating } from '@/lib/ratingUtils';

interface RatingPillProps {
  rating: number | null | undefined;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  fallback?: string;
}

export function RatingPill({ rating, size = 'sm', className, fallback = '—' }: RatingPillProps) {
  const sizeClasses = {
    xs: 'text-[9px] px-1 py-0 leading-4',
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  };

  if (!isValidRating(rating)) {
    return (
      <span className={cn('inline-flex items-center font-medium rounded tabular-nums text-muted-foreground', sizeClasses[size], className)}>
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded tabular-nums shrink-0',
        sizeClasses[size],
        getRatingPillClass(rating),
        className
      )}
    >
      {formatRating(rating)}
    </span>
  );
}
