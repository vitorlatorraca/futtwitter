import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { TEAMS_DATA } from '@/lib/team-data';
import { cn } from '@/lib/utils';
import type { TransfersScope } from './transferTypes';

/** API status for transfer_rumors. Display labels mapped in FILTERS */
type TransferStatusFilter = 'RUMOR' | 'NEGOTIATING' | 'DONE' | 'all';

interface TransferFiltersProps {
  /** 'all' = show team dropdown, 'team' = show readonly "Envolvendo: {teamName}" */
  scope: TransfersScope;
  status: TransferStatusFilter;
  onStatusChange: (s: TransferStatusFilter) => void;
  searchQ: string;
  onSearchChange: (q: string) => void;
  /** Only used when scope='all' */
  teamId?: string;
  onTeamChange?: (id: string) => void;
  /** When scope='team', shown as readonly label */
  teamName?: string;
}

const FILTERS: { value: TransferStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'RUMOR', label: 'Rumores' },
  { value: 'NEGOTIATING', label: 'Em negociação' },
  { value: 'DONE', label: 'Fechado' },
];

export function TransferFilters({
  scope,
  status,
  onStatusChange,
  searchQ,
  onSearchChange,
  teamId = '',
  onTeamChange,
  teamName,
}: TransferFiltersProps) {
  const mainTeams = TEAMS_DATA.slice(0, 12);

  return (
    <div className="space-y-3">
      {scope === 'team' && teamName && (
        <p className="text-xs text-muted-foreground">
          Mostrando negociações envolvendo <span className="font-semibold text-foreground">{teamName}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-1 rounded-full border border-white/5 bg-muted/40 p-1">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={status === f.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onStatusChange(f.value)}
            className={cn(
              'rounded-full font-semibold',
              status === f.value && 'shadow-sm'
            )}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jogador..."
            value={searchQ}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/40 border-white/5"
          />
        </div>
        {scope === 'all' && onTeamChange ? (
          <Select value={teamId || 'all'} onValueChange={(v) => onTeamChange(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm bg-muted/40 border-white/5">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os times</SelectItem>
              {mainTeams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : scope === 'team' && teamName ? (
          <div className="flex items-center h-9 px-3 rounded-lg bg-muted/40 border border-white/5 text-sm text-muted-foreground">
            Envolvendo: <span className="ml-1 font-semibold text-foreground">{teamName}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}