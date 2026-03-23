'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { getTeamCrest } from '@/lib/teamCrests';
import { Star, Check, Users } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface MatchInfo {
  id: string;
  opponent: string;
  opponentLogoUrl: string | null;
  matchDate: string;
  teamScore: number | null;
  opponentScore: number | null;
  isHomeMatch: boolean;
  competition: string | null;
  championshipRound: number | null;
}

interface MatchPlayer {
  playerId: string;
  name: string;
  knownName: string | null;
  shirtNumber: number | null;
  position: string | null;
  sector: string | null;
  photoUrl: string | null;
  wasStarter: boolean;
  minutesPlayed: number | null;
  myRating: number | null;
  communityAvg: number | null;
  voteCount: number;
}

interface MatchRatingData {
  match: MatchInfo | null;
  players: MatchPlayer[];
}

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !disabled && setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-transform ${disabled ? 'cursor-default' : 'hover:scale-110'}`}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              n <= display
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-foreground/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Sector label ─────────────────────────────────────────────────────────────

const SECTOR_LABELS: Record<string, string> = {
  GK: 'Goleiro',
  DEF: 'Defensores',
  MID: 'Meio-campistas',
  FWD: 'Atacantes',
};

function getSector(p: MatchPlayer): string {
  if (p.sector) return p.sector.toUpperCase();
  const pos = (p.position ?? '').toUpperCase();
  if (pos.includes('GK') || pos === 'GOALKEEPER') return 'GK';
  if (pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('DEF') || pos.includes('WB')) return 'DEF';
  if (pos.includes('CM') || pos.includes('DM') || pos.includes('AM') || pos.includes('MID') || pos.includes('LM') || pos.includes('RM')) return 'MID';
  return 'FWD';
}

const SECTOR_ORDER = ['GK', 'DEF', 'MID', 'FWD'];

// ─── Player row ──────────────────────────────────────────────────────────────

function PlayerRatingRow({
  player,
  teamId,
  matchId,
}: {
  player: MatchPlayer;
  teamId: string;
  matchId: string;
}) {
  const queryClient = useQueryClient();
  const [localRating, setLocalRating] = useState<number>(player.myRating ?? 0);
  const [saved, setSaved] = useState(!!player.myRating);

  const mutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch(getApiUrl('/api/ratings'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, playerId: player.playerId, rating }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // 409 = already rated — treat as soft success
        if (res.status === 409) return null;
        throw new Error(err.message ?? 'Erro ao salvar');
      }
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'last-match-for-rating'] });
    },
  });

  const handleSave = () => {
    if (localRating < 1 || saved) return;
    mutation.mutate(localRating);
  };

  const displayName = player.knownName ?? player.name;
  const communityLabel =
    player.communityAvg != null
      ? `${player.communityAvg.toFixed(1)} (${player.voteCount} voto${player.voteCount !== 1 ? 's' : ''})`
      : null;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Photo + number */}
      <div className="relative shrink-0">
        <img
          src={player.photoUrl ?? '/assets/players/placeholder.png'}
          alt={displayName}
          className="h-11 w-11 rounded-full object-cover border border-border bg-surface-elevated"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
          }}
        />
        {player.shirtNumber != null && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] px-0.5 flex items-center justify-center border border-background tabular-nums text-center">
            {player.shirtNumber}
          </span>
        )}
      </div>

      {/* Name + position */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate leading-tight">{displayName}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-foreground-secondary">{player.position ?? '—'}</span>
          {communityLabel && (
            <span className="flex items-center gap-0.5 text-[10px] text-foreground-secondary">
              <Users className="h-2.5 w-2.5" />
              {communityLabel}
            </span>
          )}
        </div>
      </div>

      {/* Rating stars + save */}
      <div className="shrink-0 flex items-center gap-2">
        {saved ? (
          <div className="flex items-center gap-1">
            <StarRating value={localRating} disabled />
            <span className="text-[11px] text-success font-semibold ml-1">
              {localRating}/10
            </span>
          </div>
        ) : (
          <>
            <StarRating
              value={localRating}
              onChange={setLocalRating}
            />
            {localRating > 0 && (
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className="ml-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

interface MatchRatingPanelProps {
  teamId: string;
  teamName: string;
  teamLogoUrl: string | null;
}

export function MatchRatingPanel({ teamId, teamName, teamLogoUrl }: MatchRatingPanelProps) {
  const { data, isLoading } = useQuery<MatchRatingData>({
    queryKey: ['/api/teams', teamId, 'last-match-for-rating'],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/last-match-for-rating`), {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Falha ao carregar partida');
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!teamId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!data?.match) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border bg-surface-card text-center px-6">
        <Star className="h-10 w-10 text-foreground/20 mb-3" />
        <p className="font-semibold text-foreground">Nenhuma partida encontrada</p>
        <p className="text-sm text-foreground-secondary mt-1">
          Partidas serão exibidas aqui assim que o time jogar.
        </p>
      </div>
    );
  }

  const { match, players } = data;

  // Group players by sector
  const grouped = SECTOR_ORDER.map((sector) => ({
    sector,
    label: SECTOR_LABELS[sector] ?? sector,
    players: players.filter((p) => getSector(p) === sector),
  })).filter((g) => g.players.length > 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const home = match.isHomeMatch ? teamName : match.opponent;
  const away = match.isHomeMatch ? match.opponent : teamName;
  const homeScore = match.isHomeMatch ? match.teamScore : match.opponentScore;
  const awayScore = match.isHomeMatch ? match.opponentScore : match.teamScore;

  const totalVotes = players.reduce((s, p) => s + p.voteCount, 0);
  const ratedCount = players.filter((p) => p.myRating != null).length;

  return (
    <div className="space-y-4">
      {/* Match header */}
      <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
        <div className="p-4 bg-surface-elevated/50 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            {/* Home */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                src={match.isHomeMatch ? (teamLogoUrl ?? getTeamCrest(teamId)) : (match.opponentLogoUrl ?? getTeamCrest(''))}
                className="h-8 w-8 object-contain shrink-0"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/crests/default.png'; }}
              />
              <span className="font-bold text-sm text-foreground truncate">{home}</span>
            </div>
            {/* Score */}
            <div className="shrink-0 text-center px-3">
              <span className="font-extrabold text-xl tabular-nums text-foreground">
                {homeScore ?? '?'} – {awayScore ?? '?'}
              </span>
            </div>
            {/* Away */}
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
              <span className="font-bold text-sm text-foreground truncate text-right">{away}</span>
              <img
                src={match.isHomeMatch ? (match.opponentLogoUrl ?? getTeamCrest('')) : (teamLogoUrl ?? getTeamCrest(teamId))}
                className="h-8 w-8 object-contain shrink-0"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/crests/default.png'; }}
              />
            </div>
          </div>
          <p className="text-xs text-foreground-secondary text-center mt-2">
            {formatDate(String(match.matchDate))}
            {match.competition ? ` · ${match.competition}` : ''}
            {match.championshipRound ? ` · Rodada ${match.championshipRound}` : ''}
          </p>
        </div>

        {/* Rating progress bar */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-foreground-secondary border-b border-border">
          <span>
            {ratedCount > 0
              ? `Você avaliou ${ratedCount} de ${players.length} jogadores`
              : `Avalie os jogadores — dê sua nota de 1 a 10`}
          </span>
          {totalVotes > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {totalVotes} voto{totalVotes !== 1 ? 's' : ''} da comunidade
            </span>
          )}
        </div>

        {/* Players grouped by sector */}
        <div className="divide-y divide-border">
          {grouped.map((group) => (
            <div key={group.sector}>
              {/* Sector header */}
              <div className="px-4 py-2 bg-surface-elevated/30 flex items-center gap-2">
                <span className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">
                  {group.label}
                </span>
                <span className="text-[10px] text-foreground-secondary bg-surface-elevated px-1.5 py-0.5 rounded-full">
                  {group.players.length}
                </span>
              </div>
              {group.players.map((p) => (
                <PlayerRatingRow
                  key={p.playerId}
                  player={p}
                  teamId={teamId}
                  matchId={match.id}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
