import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Filter, Search, Star } from 'lucide-react';
import type { Player } from '@shared/schema';
import { positionToSector, SECTOR_LABELS } from '@shared/player-sector';

type PlayerSector = 'GK' | 'DEF' | 'MID' | 'FWD';

interface SquadListProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  onRatePlayer?: (playerId: string) => void;
  /** When true, player cards are draggable (for lineup builder) */
  draggable?: boolean;
  /** Photo URL resolver */
  getPhotoUrl?: (p: Player) => string;
}

type SortOption = 'overall' | 'age' | 'name' | 'shirt';
type PositionFilter = 'ALL' | PlayerSector;

const groupLabels: Record<PlayerSector, string> = SECTOR_LABELS;

function getPositionGroup(position: string): PlayerSector {
  return positionToSector(position);
}

// TODO: Calcular overall baseado em ratings quando disponível
const calculateOverall = (player: Player): number => {
  // Mock: Por enquanto retorna um valor baseado na posição e número da camisa
  // No futuro, isso deve vir de uma média de ratings ou stats do jogador
  const shirtNumber = player.shirtNumber ?? 0;
  return 70 + (shirtNumber % 30);
};

function getPhotoUrlFallback(p: Player): string {
  return p.photoUrl ?? '/assets/players/placeholder.png';
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
          return calculateOverall(b) - calculateOverall(a);
        case 'age':
          return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
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
    const grouped: Record<string, Player[]> = {};
    filteredAndSortedPlayers.forEach((player) => {
      const group = getPositionGroup(player.position);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(player);
    });
    return grouped;
  }, [filteredAndSortedPlayers]);

  const getPlayerAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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
              <SelectItem value="age">Idade</SelectItem>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {positionPlayers.map((player) => {
                    const age = getPlayerAge(player.birthDate);
                    const overall = calculateOverall(player);
                    const shirtNumberLabel = player.shirtNumber ?? '—';
                    const nationalityLabel = player.nationalitySecondary
                      ? `${player.nationalityPrimary} / ${player.nationalitySecondary}`
                      : player.nationalityPrimary;
                    return (
                      <div
                        key={player.id}
                        className={draggable ? 'relative cursor-grab active:cursor-grabbing' : 'relative'}
                        onClick={() => onPlayerClick?.(player)}
                        draggable={!!draggable}
                        onDragStart={(e) => {
                          if (draggable) {
                            e.dataTransfer.setData('playerId', player.id);
                            e.dataTransfer.effectAllowed = 'copy';
                          }
                        }}
                      >
                        <Card className={`overflow-hidden hover:shadow-lg transition-all border-card-border hover:border-primary/50 ${draggable ? 'cursor-grab' : 'cursor-pointer'}`}>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-card-border">
                                  <img
                                    src={getPhotoUrl(player)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/players/placeholder.png'; }}
                                  />
                                </div>
                                <Badge className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-2 border-background">
                                  {shirtNumberLabel}
                                </Badge>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base truncate mb-1 text-foreground">
                                  {player.name}
                                </h4>
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                  {age && <span>Idade: {age} anos</span>}
                                  <span>Posição: {player.position}</span>
                                  <span>Nacionalidade: {nationalityLabel}</span>
                                  {player.fromClub ? <span>Origem: {player.fromClub}</span> : null}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <span className="text-sm font-bold text-foreground">{overall}</span>
                                  <span className="text-xs text-muted-foreground">Overall</span>
                                </div>
                              </div>
                            </div>

                            {onRatePlayer && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRatePlayer(player.id);
                                }}
                              >
                                Avaliar
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
