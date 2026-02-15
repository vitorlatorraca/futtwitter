import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import type { TransferItem } from './transferTypes';

/** API status (transfer_rumors). Maps to display: RUMOR, NEGOCIACAO, FECHADO */
export type TransferRumorApiStatus = 'RUMOR' | 'NEGOTIATING' | 'DONE' | 'CANCELLED';

export const transfersQueryKey = (filters: { status?: string; q?: string; teamId?: string }) =>
  ['transferRumors', filters] as const;

/** Normalize transfer rumor API response to TransferItem */
function normalizeRumorToItem(raw: {
  id: string;
  player?: { name: string; photoUrl: string | null; position?: string | null };
  fromTeam?: { id: string; name: string; shortName?: string; slug?: string } | null;
  toTeam?: { id: string; name: string; shortName?: string; slug?: string } | null;
  status: string;
  feeAmount?: string | number | null;
  feeCurrency?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
  author?: { id: string; name: string; avatarUrl: string | null; badge?: string } | null;
  selling?: { likes: number; dislikes: number; userVote?: string | null };
  buying?: { likes: number; dislikes: number; userVote?: string | null };
}): TransferItem {
  const statusMap: Record<string, TransferItem['status']> = {
    RUMOR: 'RUMOR',
    NEGOTIATING: 'NEGOCIACAO',
    DONE: 'FECHADO',
    CANCELLED: 'FECHADO',
  };
  const feeText =
    raw.feeAmount != null && raw.feeAmount !== ''
      ? `${raw.feeCurrency ?? 'BRL'} ${Number(raw.feeAmount).toLocaleString('pt-BR')}`
      : null;
  return {
    id: raw.id,
    playerName: raw.player?.name ?? '?',
    playerPhotoUrl: raw.player?.photoUrl ?? null,
    positionAbbrev: raw.player?.position ?? '—',
    fromTeam: raw.fromTeam ?? null,
    toTeam: raw.toTeam ?? null,
    fromTeamId: raw.fromTeam?.id,
    toTeamId: raw.toTeam?.id,
    status: statusMap[raw.status] ?? 'RUMOR',
    updatedAt: raw.updatedAt ?? raw.createdAt,
    feeText,
    notes: raw.note ?? null,
    author: raw.author ? { ...raw.author, badge: raw.author.badge ?? 'Jornalista' } : null,
    selling: raw.selling ?? { likes: 0, dislikes: 0, userVote: null },
    buying: raw.buying ?? { likes: 0, dislikes: 0, userVote: null },
  };
}

export function useTransfers(filters: { status?: string; q?: string; teamId?: string }) {
  return useQuery<TransferItem[]>({
    queryKey: transfersQueryKey(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.q) params.set('q', filters.q);
      if (filters.teamId) params.set('teamId', filters.teamId);
      const qs = params.toString();
      const url = getApiUrl(`/api/transfer-rumors${qs ? `?${qs}` : ''}`);
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch transfers');
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeRumorToItem) : [];
    },
  });
}

export type VoteSide = 'SELLING' | 'BUYING';
export type VoteValue = 'LIKE' | 'DISLIKE' | 'CLEAR';

export interface VoteResult {
  selling: { likes: number; dislikes: number };
  buying: { likes: number; dislikes: number };
  userVoteSelling: 'LIKE' | 'DISLIKE' | null;
  userVoteBuying: 'LIKE' | 'DISLIKE' | null;
}

/** Vote on transfer rumor (Vai e Vem - /api/transfer-rumors/:id/vote) */
export function useTransferVote(rumorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ side, vote }: { side: VoteSide; vote: VoteValue }): Promise<VoteResult> => {
      const res = await fetch(getApiUrl(`/api/transfer-rumors/${rumorId}/vote`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side, vote }),
        credentials: 'include',
      });
      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Você não pode votar neste lado.');
      }
      if (!res.ok) throw new Error('Erro ao registrar voto');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferRumors'] });
    },
  });
}
