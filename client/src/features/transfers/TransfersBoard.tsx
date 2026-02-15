'use client';

import { useState, useMemo, useEffect } from 'react';
import { TransferFilters } from './TransferFilters';
import { TransferList } from './TransferList';
import { useTransfers } from './api';
import { Panel } from '@/components/ui-premium';
import type { TransfersScope } from './transferTypes';

const SEARCH_DEBOUNCE_MS = 300;

interface TransfersBoardProps {
  /** 'all' = full market, 'team' = filtered by user's team */
  scope: TransfersScope;
  /** Required when scope='team' — filters transfers where fromTeamId or toTeamId = teamId */
  teamId?: string;
  /** Team display name when scope='team' — shown in label "Mostrando negociações envolvendo {teamName}" */
  teamName?: string;
  /** Hide header (title + description). Use when embedded in another page with its own header. */
  hideHeader?: boolean;
}

export function TransfersBoard({
  scope,
  teamId,
  teamName,
  hideHeader = false,
}: TransfersBoardProps) {
  const [status, setStatus] = useState<'RUMOR' | 'NEGOTIATING' | 'DONE' | 'all'>('all');
  const [searchQ, setSearchQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [teamFilterId, setTeamFilterId] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQ), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQ]);

  const effectiveTeamId = scope === 'team' ? teamId : undefined;
  const filters = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      q: debouncedQ.trim() || undefined,
      teamId: effectiveTeamId || teamFilterId || undefined,
    }),
    [status, debouncedQ, effectiveTeamId, teamFilterId]
  );

  const { data: items = [], isLoading } = useTransfers(filters);

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <header className="space-y-1">
          <h2 className="font-display text-lg font-bold text-foreground">Vai e Vem</h2>
          <p className="text-sm text-muted-foreground">
            {scope === 'team' && teamName
              ? `Mercado do seu time — negociações envolvendo ${teamName}`
              : 'Mercado, rumores e transferências — em tempo real (demo).'}
          </p>
        </header>
      )}

      <Panel padding="sm">
        <TransferFilters
          scope={scope}
          status={status}
          onStatusChange={setStatus}
          searchQ={searchQ}
          onSearchChange={setSearchQ}
          teamId={scope === 'team' ? undefined : teamFilterId}
          onTeamChange={scope === 'team' ? undefined : setTeamFilterId}
          teamName={scope === 'team' ? teamName : undefined}
        />
      </Panel>

      <Panel padding="none">
        <TransferList items={items} isLoading={isLoading} />
      </Panel>
    </div>
  );
}
