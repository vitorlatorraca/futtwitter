'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui-premium';
import { Crest } from '@/components/ui-premium';
import { EmptyState } from '@/components/ui/empty-state';
import { ArrowLeftRight, Edit, Trash2, ArrowRight } from 'lucide-react';
import { useMyTransferRumors, useDeleteTransferRumor, type TransferRumorItem, type TransferRumorStatus } from './api';
import { useToast } from '@/hooks/use-toast';

const STATUS_LABELS: Record<TransferRumorStatus, string> = {
  RUMOR: 'Rumor',
  NEGOTIATING: 'Em negociação',
  DONE: 'Fechado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANTS: Record<TransferRumorStatus, 'outline' | 'secondary' | 'default' | 'destructive'> = {
  RUMOR: 'outline',
  NEGOTIATING: 'secondary',
  DONE: 'default',
  CANCELLED: 'destructive',
};

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

interface RumorRowProps {
  rumor: TransferRumorItem;
  onEdit: (rumor: TransferRumorItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function RumorRow({ rumor, onEdit, onDelete, isDeleting }: RumorRowProps) {
  const sellingLikes = rumor.selling?.likes ?? 0;
  const sellingDislikes = rumor.selling?.dislikes ?? 0;
  const buyingLikes = rumor.buying?.likes ?? 0;
  const buyingDislikes = rumor.buying?.dislikes ?? 0;

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-card-border last:border-0">
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {rumor.player.photoUrl ? (
          <img
            src={rumor.player.photoUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-medium flex-shrink-0">
            ?
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{rumor.player.name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-sm text-foreground-muted">
            <div className="flex items-center gap-1">
              <Crest slug={rumor.fromTeam?.id} alt={rumor.fromTeam?.name} size="xs" />
              <span className="truncate max-w-[80px]">{rumor.fromTeam?.shortName ?? rumor.fromTeam?.name}</span>
            </div>
            <ArrowRight className="h-3 w-3 flex-shrink-0" />
            <div className="flex items-center gap-1">
              <Crest slug={rumor.toTeam?.id} alt={rumor.toTeam?.name} size="xs" />
              <span className="truncate max-w-[80px]">{rumor.toTeam?.shortName ?? rumor.toTeam?.name}</span>
            </div>
          </div>
        </div>
        <Badge variant={STATUS_VARIANTS[rumor.status]} className="flex-shrink-0">
          {STATUS_LABELS[rumor.status]}
        </Badge>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-foreground-muted whitespace-nowrap">
          {formatTimeAgo(rumor.createdAt)}
        </span>
        {(sellingLikes + sellingDislikes + buyingLikes + buyingDislikes) > 0 && (
          <span className="text-xs text-foreground-muted">
            👍{sellingLikes + buyingLikes} 👎{sellingDislikes + buyingDislikes}
          </span>
        )}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(rumor)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hover:border-danger/30 hover:bg-danger/10"
            onClick={() => onDelete(rumor.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MyTransferRumorsCardProps {
  onNewClick?: () => void;
  onEditClick?: (rumor: TransferRumorItem) => void;
}

export function MyTransferRumorsCard({ onNewClick, onEditClick }: MyTransferRumorsCardProps) {
  const { data: rumors = [], isLoading, isError, error } = useMyTransferRumors();
  const deleteMutation = useDeleteTransferRumor();
  const { toast } = useToast();

  const handleEdit = (rumor: TransferRumorItem) => {
    onEditClick?.(rumor);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta negociação?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Negociação excluída', description: 'A negociação foi removida.' });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: err?.message || 'Tente novamente.',
      });
    }
  };

  return (
    <Card className="rounded-2xl border border-white/5 bg-card hover:border-white/10 transition-colors">
        <CardContent className="p-6">
          <SectionHeader
            title="Minhas Negociações"
            subtitle="Rumores e negociações que você criou no Vai e Vem."
          />
          {isLoading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className="h-10 w-10 rounded-full bg-surface-elevated border border-card-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-surface-elevated border border-card-border" />
                    <div className="h-3 w-24 rounded bg-surface-elevated border border-card-border" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="mt-4 py-4 text-center text-sm text-muted-foreground">
              Erro ao carregar negociações. {error instanceof Error ? error.message : 'Tente novamente.'}
            </div>
          ) : rumors.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="Nenhuma negociação ainda"
              description="Crie sua primeira negociação no Vai e Vem."
              actionLabel="Nova negociação"
              onAction={onNewClick}
              className="mt-4"
            />
          ) : (
            <div className="mt-4 divide-y-0">
              {rumors.map((rumor) => (
                <RumorRow
                  key={rumor.id}
                  rumor={rumor}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
  );
}
