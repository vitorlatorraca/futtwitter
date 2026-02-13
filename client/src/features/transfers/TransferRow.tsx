import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatBadge, Crest } from '@/components/ui-premium';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/auth-context';
import { useTransferVote } from './api';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TransferItem } from './transferTypes';

const STATUS_LABELS: Record<string, string> = {
  RUMOR: 'Rumor',
  NEGOCIACAO: 'Em negociação',
  FECHADO: 'Fechado',
};

const STATUS_VARIANTS: Record<string, 'rumor' | 'negociacao' | 'fechado'> = {
  RUMOR: 'rumor',
  NEGOCIACAO: 'negociacao',
  FECHADO: 'fechado',
};

interface TransferRowProps {
  item: TransferItem;
}

export function TransferRow({ item }: TransferRowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const voteMutation = useTransferVote(item.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const photoUrl = item.playerPhotoUrl || '/assets/players/placeholder.png';

  const canVote = !!user && !item.viewerVote;
  const hasVoted = !!item.viewerVote;

  const handleVote = (vote: 'UP' | 'DOWN') => {
    if (!canVote) return;
    voteMutation.mutate(vote, {
      onSuccess: () => {
        toast({ title: 'Voto registrado!', description: `Você votou ${vote === 'UP' ? '👍' : '👎'}` });
      },
      onError: (err) => {
        toast({ variant: 'destructive', title: 'Erro', description: err.message });
      },
    });
  };

  const voteButtons = (
    <div className="flex items-center gap-1 shrink-0">
      {!user ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-emerald-600/90">👍 {item.upPercent}%</span>
                <span className="text-rose-600/90">👎 {item.downPercent}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Faça login para votar</TooltipContent>
          </Tooltip>
        ) : hasVoted ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-emerald-600/90">👍 {item.upPercent}%</span>
            <span className="text-rose-600/90">👎 {item.downPercent}%</span>
            <span className="text-foreground-secondary">
              Você votou {item.viewerVote === 'UP' ? '👍' : '👎'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-emerald-600 hover:bg-emerald-500/20"
              onClick={(e) => {
                e.stopPropagation();
                handleVote('UP');
              }}
              disabled={voteMutation.isPending}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[3rem]">
              👍{item.upPercent}% 👎{item.downPercent}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-rose-600 hover:bg-rose-500/20"
              onClick={(e) => {
                e.stopPropagation();
                handleVote('DOWN');
              }}
              disabled={voteMutation.isPending}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
    </div>
  );

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 py-3 px-2 rounded-medium hover:bg-surface-elevated/60 transition-colors text-left"
        >
          <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border">
            <AvatarImage src={photoUrl} alt={item.playerName} />
            <AvatarFallback className="text-xs bg-muted">
              {item.playerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground truncate">{item.playerName}</span>
              <span className="text-xs text-muted-foreground font-mono">{item.positionAbbrev}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Crest slug={item.fromTeam?.slug} alt={item.fromTeam?.name ?? '?'} size="xs" />
              <span className="text-muted-foreground text-xs">→</span>
              <Crest slug={item.toTeam?.slug} alt={item.toTeam?.name ?? '?'} size="xs" />
            </div>
          </div>

          <StatBadge
            variant={STATUS_VARIANTS[item.status] ?? 'rumor'}
            label={STATUS_LABELS[item.status] ?? item.status}
            size="sm"
            className="shrink-0"
          />

          {voteButtons}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={photoUrl} alt={item.playerName} />
              <AvatarFallback>{item.playerName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div>{item.playerName}</div>
              <div className="text-sm font-normal text-muted-foreground">{item.positionAbbrev}</div>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
          <div className="flex items-center gap-3">
            <Crest slug={item.fromTeam?.slug} alt={item.fromTeam?.name ?? '?'} size="md" />
            <span className="text-sm font-medium">{item.fromTeam?.name ?? '?'}</span>
            <span className="text-muted-foreground">→</span>
            <Crest slug={item.toTeam?.slug} alt={item.toTeam?.name ?? '?'} size="md" />
            <span className="text-sm font-medium">{item.toTeam?.name ?? '?'}</span>
          </div>
          {item.feeText && (
            <p className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {item.feeText}
            </p>
          )}
          {item.notes && <p className="text-sm">{item.notes}</p>}
          <p className="text-xs text-muted-foreground">
            Atualizado {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: ptBR })}
          </p>
          <div className="flex items-center gap-4 pt-2">{voteButtons}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
