import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import type { TransferItem } from './transferTypes';

export const transfersQueryKey = (filters: { status?: string; q?: string; teamId?: string }) =>
  ['transfers', filters] as const;

export function useTransfers(filters: { status?: string; q?: string; teamId?: string }) {
  return useQuery<TransferItem[]>({
    queryKey: transfersQueryKey(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.q) params.set('q', filters.q);
      if (filters.teamId) params.set('teamId', filters.teamId);
      const qs = params.toString();
      const url = getApiUrl(`/api/transfers${qs ? `?${qs}` : ''}`);
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch transfers');
      return res.json();
    },
  });
}

export function useTransferVote(transferId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vote: 'UP' | 'DOWN') => {
      const res = await fetch(getApiUrl(`/api/transfers/${transferId}/vote`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
        credentials: 'include',
      });
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Você já votou neste item.');
      }
      if (!res.ok) throw new Error('Erro ao registrar voto');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
}
