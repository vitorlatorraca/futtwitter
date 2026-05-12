import { AppShell } from '@/components/ui/app-shell';
import { TransfersBoard } from '@/features/transfers';
import { PageHeader } from '@/components/ui/page';
import { useAuth } from '@/lib/auth-context';
import { getClubConfig } from '@/features/meu-time';

export default function VaiEVemPage() {
  const { user } = useAuth();
  const teamId = user?.teamId ?? undefined;
  const clubConfig = teamId ? getClubConfig(teamId) : null;
  const teamName = clubConfig?.displayName ?? 'seu time';

  return (
    <AppShell>
      <PageHeader
        title="Vai e Vem"
        description="Transferências, rumores e negociações do futebol brasileiro."
      />
      <TransfersBoard
        scope={teamId ? 'team' : 'all'}
        teamId={teamId}
        teamName={teamName}
      />
    </AppShell>
  );
}
