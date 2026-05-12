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
import { ThumbsUp, ThumbsDown, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TransferItem, TransferVoteBlock } from './transferTypes';

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

type VoteSide = 'SELLING' | 'BUYING';

interface VoteBlockProps {
  label: string;
  block: TransferVoteBlock;
  side: VoteSide;
  canVote: boolean;
  disabledReason: string;
  onVote: (side: VoteSide, vote: 'LIKE' | 'DISLIKE' | 'CLEAR') => void;
  isPending: boolean;
}

function VoteBlock({ label, block, side, canVote, disabledReason, onVote, isPending }: VoteBlockProps) {
  const content = (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] text-muted-foreground truncate">{label}</span>
      <div className="flex items-center gap-1">
        {canVote ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-emerald-600 hover:bg-emerald-500/20"
              onClick={(e) => {
                e.stopPropagation();
                onVote(side, block.userVote === 'LIKE' ? 'CLEAR' : 'LIKE');
              }}
              disabled={isPending}
            >
              <ThumbsUp className={`h-3 w-3 ${block.userVote === 'LIKE' ? 'opacity-100 fill-current' : 'opacity-60'}`} />
            </Button>
            <span className="text-[10px] text-muted-foreground min-w-[2rem]">
              {block.likes}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-rose-600 hover:bg-rose-500/20"
              onClick={(e) => {
                e.stopPropagation();
                onVote(side, block.userVote === 'DISLIKE' ? 'CLEAR' : 'DISLIKE');
              }}
              disabled={isPending}
            >
              <ThumbsDown className={`h-3 w-3 ${block.userVote === 'DISLIKE' ? 'opacity-100 fill-current' : 'opacity-60'}`} />
            </Button>
            <span className="text-[10px] text-muted-foreground min-w-[2rem]">
              {block.dislikes}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="text-emerald-600/90">👍 {block.likes}</span>
            <span className="text-rose-600/90">👎 {block.dislikes}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!canVote && disabledReason) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="opacity-70 cursor-not-allowed">{content}</div>
        </TooltipTrigger>
        <TooltipContent>{disabledReason}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

interface TransferRowProps {
  item: TransferItem;
}

export function TransferRow({ item }: TransferRowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const voteMutation = useTransferVote(item.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const photoUrl = item.playerPhotoUrl || '/assets/players/placeholder.png';

  const fromTeamId = item.fromTeamId ?? item.fromTeam?.id;
  const toTeamId = item.toTeamId ?? item.toTeam?.id;
  const canVoteSelling = !!user && !!fromTeamId && user.teamId === fromTeamId;
  const canVoteBuying = !!user && !!toTeamId && user.teamId === toTeamId;

  const handleVote = (side: 'SELLING' | 'BUYING', vote: 'LIKE' | 'DISLIKE' | 'CLEAR') => {
    voteMutation.mutate(
      { side, vote },
      {
        onSuccess: () => {
          const msg = vote === 'CLEAR' ? 'Voto removido' : `Você votou ${vote === 'LIKE' ? '👍' : '👎'}`;
          toast({ title: msg });
        },
        onError: (err) => {
          toast({ variant: 'destructive', title: 'Erro', description: err.message });
        },
      }
    );
  };

  const fromShort = item.fromTeam?.shortName ?? item.fromTeam?.name?.slice(0, 3) ?? '?';
  const toShort = item.toTeam?.shortName ?? item.toTeam?.name?.slice(0, 3) ?? '?';

  const voteBlocks = (
    <div className="flex items-center gap-3 shrink-0">
      {!user ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>Torcida {fromShort}: 👍{item.selling.likes} 👎{item.selling.dislikes}</span>
              <span>Torcida {toShort}: 👍{item.buying.likes} 👎{item.buying.dislikes}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Faça login para votar</TooltipContent>
        </Tooltip>
      ) : (
        <>
          <VoteBlock
            label={`Torcida ${fromShort} (vendendo)`}
            block={item.selling}
            side="SELLING"
            canVote={canVoteSelling}
            disabledReason={`Apenas torcedores do ${item.fromTeam?.name ?? 'time'} podem votar aqui`}
            onVote={handleVote}
            isPending={voteMutation.isPending}
          />
          <VoteBlock
            label={`Torcida ${toShort} (comprando)`}
            block={item.buying}
            side="BUYING"
            canVote={canVoteBuying}
            disabledReason={`Apenas torcedores do ${item.toTeam?.name ?? 'time'} podem votar aqui`}
            onVote={handleVote}
            isPending={voteMutation.isPending}
          />
        </>
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
            {item.author && (
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                <Newspaper className="h-2.5 w-2.5" />
                <span>Por: {item.author.name}</span>
                <span className="px-1 py-0.5 rounded bg-muted/80 text-[9px] font-medium">
                  {item.author.badge}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <Crest slug={item.fromTeam?.slug ?? item.fromTeam?.id} alt={item.fromTeam?.name ?? '?'} size="xs" />
              <span className="text-muted-foreground text-xs">→</span>
              <Crest slug={item.toTeam?.slug ?? item.toTeam?.id} alt={item.toTeam?.name ?? '?'} size="xs" />
            </div>
          </div>

          <StatBadge
            variant={STATUS_VARIANTS[item.status] ?? 'rumor'}
            label={STATUS_LABELS[item.status] ?? item.status}
            size="sm"
            className="shrink-0"
          />

          {voteBlocks}
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
              {item.author && (
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>Por: {item.author.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">
                    {item.author.badge}
                  </span>
                </div>
              )}
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
          <div className="flex items-center gap-3">
            <Crest slug={item.fromTeam?.slug ?? item.fromTeam?.id} alt={item.fromTeam?.name ?? '?'} size="md" />
            <span className="text-sm font-medium">{item.fromTeam?.name ?? '?'}</span>
            <span className="text-muted-foreground">→</span>
            <Crest slug={item.toTeam?.slug ?? item.toTeam?.id} alt={item.toTeam?.name ?? '?'} size="md" />
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
          <div className="flex flex-wrap gap-4 pt-2">{voteBlocks}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
