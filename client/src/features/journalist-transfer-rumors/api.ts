import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';

export const TRANSFER_RUMOR_STATUSES = ['RUMOR', 'NEGOTIATING', 'DONE', 'CANCELLED'] as const;
export type TransferRumorStatus = (typeof TRANSFER_RUMOR_STATUSES)[number];

export interface TransferRumorPlayer {
  id: string;
  name: string;
  photoUrl: string | null;
  position: string | null;
}

export interface TransferRumorTeam {
  id: string;
  name: string;
  shortName?: string;
  slug?: string;
}

export interface TransferRumorItem {
  id: string;
  player: TransferRumorPlayer;
  fromTeam: TransferRumorTeam | null;
  toTeam: TransferRumorTeam | null;
  status: TransferRumorStatus;
  feeAmount: string | number | null;
  feeCurrency: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  note: string | null;
  createdAt: string;
  updatedAt?: string;
  selling?: { likes: number; dislikes: number; userVote?: string | null };
  buying?: { likes: number; dislikes: number; userVote?: string | null };
}

export interface CreateTransferRumorInput {
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  status?: TransferRumorStatus;
  feeAmount?: number | null;
  feeCurrency?: string;
  contractUntil?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  note?: string | null;
}

export interface UpdateTransferRumorInput {
  status?: TransferRumorStatus;
  feeAmount?: number | null;
  feeCurrency?: string | null;
  contractUntil?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  note?: string | null;
}

export function useMyTransferRumors() {
  const { user } = useAuth();
  const isJournalistOrAdmin = user?.userType === 'JOURNALIST' || user?.userType === 'ADMIN';

  return useQuery<TransferRumorItem[]>({
    queryKey: ['/api/transfer-rumors/mine'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/transfer-rumors/mine'), { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao buscar negociações');
      return res.json();
    },
    enabled: isJournalistOrAdmin,
  });
}

export function useCreateTransferRumor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTransferRumorInput): Promise<TransferRumorItem> => {
      const res = await fetch(getApiUrl('/api/transfer-rumors'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao criar negociação');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors/mine'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors'] });
      queryClient.invalidateQueries({ queryKey: ['transferRumors'] });
    },
  });
}

export function useUpdateTransferRumor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransferRumorInput }): Promise<TransferRumorItem> => {
      const res = await fetch(getApiUrl(`/api/transfer-rumors/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao atualizar negociação');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors/mine'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors'] });
      queryClient.invalidateQueries({ queryKey: ['transferRumors'] });
    },
  });
}

export function useDeleteTransferRumor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(getApiUrl(`/api/transfer-rumors/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao excluir negociação');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors/mine'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transfer-rumors'] });
      queryClient.invalidateQueries({ queryKey: ['transferRumors'] });
    },
  });
}
