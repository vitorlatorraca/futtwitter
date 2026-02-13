import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Filter, Search, Star } from 'lucide-react';
import type { Player } from '@shared/schema';
import { positionToSector, SECTOR_LABELS } from '@shared/player-sector';

type PlayerSector = 'GK' | 'DEF' | 'MID' | 'FWD';

/** Player with optional overall from DB (players.overall or equivalent) */
type PlayerWithOverall = Player & { overall?: number | null };

interface SquadListProps {
  players: PlayerWithOverall[];
  onPlayerClick?: (player: Player) => void;
  onRatePlayer?: (playerId: string) => void;
  /** When true, player cards are draggable (for lineup builder) */
  draggable?: boolean;
  /** Photo URL resolver */
  getPhotoUrl?: (p: Player) => string;
}

type SortOption = 'overall' | 'name' | 'shirt';
type PositionFilter = 'ALL' | PlayerSector;

const groupLabels: Record<PlayerSector, string> = SECTOR_LABELS;

function getPositionGroup(position: string): PlayerSector {
  return positionToSector(position);
}

/** Overall from DB when available; otherwise "—" for display */
function getOverallDisplay(player: PlayerWithOverall): number | string {
  const v = player.overall;
  if (v != null && typeof v === 'number' && !Number.isNaN(v)) return v;
  return '—';
}

/** For sorting by overall when DB has no overall field (fallback order) */
function getOverallSortValue(player: PlayerWithOverall): number {
  const v = player.overall;
  if (v != null && typeof v === 'number') return v;
  return (player.shirtNumber ?? 0) % 30;
}

function getPhotoUrlFallback(p: Player): string {
  return p.photoUrl ?? '/assets/players/placeholder.png';
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase() || '?';
}

/** Minimal premium card: photo, name, position, overall only. Clicável (hover). */
function SquadPlayerCard({
  player,
  draggable,
  getPhotoUrl,
  onPlayerClick,
  onDragStart,
}: {
  player: PlayerWithOverall;
  draggable: boolean;
  getPhotoUrl: (p: Player) => string;
  onPlayerClick?: (player: Player) => void;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = getPhotoUrl(player);
  const showPlaceholder = imgError || !player.photoUrl;
  const overallDisplay = getOverallDisplay(player);

  return (
    <div
      className={draggable ? 'relative cursor-grab active:cursor-grabbing' : 'relative'}
      onClick={() => onPlayerClick?.(player)}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <Card className="overflow-hidden transition-all border-card-border hover:shadow-lg hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background outline-none group cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-card-border flex-shrink-0">
            {showPlaceholder ? (
              <span className="text-xl font-bold text-muted-foreground select-none" aria-hidden>
                {getInitials(player.name)}
              </span>
            ) : (
              <img
                src={photoUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="min-w-0 w-full space-y-1">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {player.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {player.position}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 flex-shrink-0" aria-hidden />
              <span className="text-sm font-bold text-foreground tabular-nums">
                {overallDisplay}
              </span>
              <span className="sr-only">Overall</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SquadList({ players, onPlayerClick, onRatePlayer, draggable, getPhotoUrl = getPhotoUrlFallback }: SquadListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('shirt');

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = [...players];

    // Filter by position
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter((p) => getPositionGroup(p.position) === positionFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query) ||
          p.nationalityPrimary.toLowerCase().includes(query) ||
          (p.nationalitySecondary?.toLowerCase().includes(query) ?? false) ||
          (p.fromClub?.toLowerCase().includes(query) ?? false) ||
          (p.shirtNumber !== null && p.shirtNumber !== undefined
            ? p.shirtNumber.toString().includes(query)
            : false)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'overall':
          return getOverallSortValue(b) - getOverallSortValue(a);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'shirt':
        default:
          if (a.shirtNumber == null && b.shirtNumber == null) return 0;
          if (a.shirtNumber == null) return 1;
          if (b.shirtNumber == null) return -1;
          return a.shirtNumber - b.shirtNumber;
      }
    });

    return filtered;
  }, [players, positionFilter, searchQuery, sortBy]);

  const groupedPlayers = useMemo(() => {
    const grouped: Record<string, PlayerWithOverall[]> = {};
    filteredAndSortedPlayers.forEach((player) => {
      const group = getPositionGroup(player.position);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(player);
    });
    return grouped;
  }, [filteredAndSortedPlayers]);

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Elenco ({filteredAndSortedPlayers.length} jogadores)
          </CardTitle>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jogador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={positionFilter} onValueChange={(v: string) => setPositionFilter(v as PositionFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as Posições</SelectItem>
              <SelectItem value="GK">Goleiros</SelectItem>
              <SelectItem value="DEF">Defensores</SelectItem>
              <SelectItem value="MID">Meio-campistas</SelectItem>
              <SelectItem value="FWD">Atacantes</SelectItem>
            </SelectContent>
          </Select>
            <Select value={sortBy} onValueChange={(v: string) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shirt">Número da Camisa</SelectItem>
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {Object.keys(groupedPlayers).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum jogador encontrado</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
              <div key={position}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg uppercase tracking-wide text-foreground">
                    {(groupLabels as any)[position] || position}
                  </h3>
                  <Badge variant="secondary">{positionPlayers.length}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {positionPlayers.map((player) => (
                    <SquadPlayerCard
                      key={player.id}
                      player={player}
                      draggable={!!draggable}
                      getPhotoUrl={getPhotoUrl}
                      onPlayerClick={onPlayerClick}
                      onDragStart={draggable ? (e) => {
                        e.dataTransfer.setData('playerId', player.id);
                        e.dataTransfer.effectAllowed = 'copy';
                      } : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
