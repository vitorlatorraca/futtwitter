'use client';

import { cn } from '@/lib/utils';

const CARD_BASE =
  'rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0f1419] to-[#0a0e12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] overflow-hidden';

interface MyTeamCardProps {
  title: React.ReactNode;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Altura fixa para alinhamento (ex: h-[520px]) */
  heightClass?: string;
}

export function MyTeamCard({
  title,
  rightSlot,
  children,
  className,
  heightClass,
}: MyTeamCardProps) {
  return (
    <div
      className={cn(
        CARD_BASE,
        'flex flex-col',
        heightClass,
        className
      )}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-white/[0.06] shrink-0">
        <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
          {title}
        </h3>
        {rightSlot ? (
          <div className="shrink-0">{rightSlot}</div>
        ) : null}
      </header>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}

interface MyTeamCardSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Se true, área scrollável */
  scrollable?: boolean;
}

export function MyTeamCardSection({
  children,
  className,
  scrollable = false,
}: MyTeamCardSectionProps) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0',
        scrollable && 'overflow-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
