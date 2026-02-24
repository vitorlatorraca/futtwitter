import { cn } from '@/lib/utils';
import { positionToPtBr, positionToSectorFromCanonical } from '@shared/positions';
import type { PositionSector } from '@shared/positions';

const SECTOR_COLORS: Record<PositionSector, string> = {
  GK: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
  DEF: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  MID: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  FWD: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

interface PositionBadgeProps {
  position: string | null | undefined;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function PositionBadge({ position, size = 'sm', className }: PositionBadgeProps) {
  const label = positionToPtBr(position);
  const sector = positionToSectorFromCanonical(position);
  const colorClass = SECTOR_COLORS[sector];

  const sizeClasses = {
    xs: 'text-[9px] px-1 py-0 leading-4',
    sm: 'text-[10px] px-1.5 py-0.5 leading-4',
    md: 'text-xs px-2 py-0.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wide rounded border tabular-nums shrink-0',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
