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

type TransferStatus = 'RUMOR' | 'NEGOCIACAO' | 'FECHADO';

interface TransferFiltersProps {
  status: TransferStatus | 'all';
  onStatusChange: (s: TransferStatus | 'all') => void;
  searchQ: string;
  onSearchChange: (q: string) => void;
  teamId: string;
  onTeamChange: (id: string) => void;
}

const FILTERS: { value: TransferStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'RUMOR', label: 'Rumores' },
  { value: 'NEGOCIACAO', label: 'Em negociação' },
  { value: 'FECHADO', label: 'Fechado' },
];

export function TransferFilters({
  status,
  onStatusChange,
  searchQ,
  onSearchChange,
  teamId,
  onTeamChange,
}: TransferFiltersProps) {
  const mainTeams = TEAMS_DATA.slice(0, 12);

  return (
    <div className="space-y-3">
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
      </div>
    </div>
  );
}