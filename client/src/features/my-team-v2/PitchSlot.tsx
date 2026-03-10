import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PitchSlotProps {
  slotIndex: number;
  slotId: string;
  x: number;
  y: number;
  isSelected: boolean;
  isEmpty: boolean;
  onSlotClick: () => void;
  children?: React.ReactNode;
}

export function PitchSlot({
  slotIndex,
  slotId,
  x,
  y,
  isSelected,
  isEmpty,
  onSlotClick,
  children,
}: PitchSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children ? (
        <div
          className={cn(
            'rounded-full transition-all duration-150',
            isOver && 'ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent scale-[1.02]'
          )}
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={onSlotClick}
          className={cn(
            'flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full',
            'border-2 border-dashed border-primary/35 bg-primary/8',
            'hover:border-primary/55 hover:bg-primary/18 hover:scale-[1.03] hover:shadow-glow-primary',
            'transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent',
            isSelected &&
              'border-primary border-solid ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent bg-primary/10',
            isOver && 'border-primary/70 bg-primary/20 ring-2 ring-primary/60'
          )}
        >
          <Plus className="h-6 w-6 text-primary/70" />
        </button>
      )}
    </div>
  );
}
