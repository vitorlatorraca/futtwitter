'use client';

import { useState, useMemo } from 'react';
import { AppShell } from '@/components/ui/app-shell';
import { TransferFilters } from '@/features/transfers/TransferFilters';
import { TransferList } from '@/features/transfers/TransferList';
import { useTransfers } from '@/features/transfers/api';
import { Panel, SectionHeader } from '@/components/ui-premium';
import { typography } from '@/lib/ui';
import { cn } from '@/lib/utils';
import { ArrowLeftRight } from 'lucide-react';

export default function VaiEVemPage() {
  const [status, setStatus] = useState<'RUMOR' | 'NEGOCIACAO' | 'FECHADO' | 'all'>('all');
  const [searchQ, setSearchQ] = useState('');
  const [teamId, setTeamId] = useState('');

  const filters = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      q: searchQ.trim() || undefined,
      teamId: teamId || undefined,
    }),
    [status, searchQ, teamId]
  );

  const { data: items = [], isLoading } = useTransfers(filters);

  return (
    <AppShell mainClassName="py-4 sm:py-6 md:py-8 px-3 sm:px-4 max-w-4xl mx-auto">
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className={cn(typography.headingLG, "flex items-center gap-2")}>
            <ArrowLeftRight className="h-7 w-7 text-primary" />
            Vai e Vem
          </h1>
          <p className={typography.bodyMuted}>
            Mercado, rumores e transferências — em tempo real (demo).
          </p>
        </header>

        <Panel padding="sm">
          <TransferFilters
            status={status}
            onStatusChange={setStatus}
            searchQ={searchQ}
            onSearchChange={setSearchQ}
            teamId={teamId}
            onTeamChange={setTeamId}
          />
        </Panel>

        <Panel padding="none">
          <TransferList items={items} isLoading={isLoading} />
        </Panel>
      </div>
    </AppShell>
  );
}
