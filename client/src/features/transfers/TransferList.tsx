import { TransferRow } from './TransferRow';
import { CompactList, LoadingSkeleton, EmptyState } from '@/components/ui-premium';
import { ArrowLeftRight } from 'lucide-react';
import type { TransferItem } from './transferTypes';

interface TransferListProps {
  items: TransferItem[];
  isLoading: boolean;
}

export function TransferList({ items, isLoading }: TransferListProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSkeleton variant="list" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Nenhuma transferência encontrada"
        description="Tente ajustar os filtros."
        className="m-4"
      />
    );
  }

  return (
    <CompactList>
      {items.map((item) => (
        <TransferRow key={item.id} item={item} />
      ))}
    </CompactList>
  );
}
