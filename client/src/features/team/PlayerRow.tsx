import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Player } from '@shared/schema';
import { toPtBrAbbrev } from '@/lib/positionAbbrev';

/** Simple country name to flag emoji (ISO 3166-1 alpha-2) */
const COUNTRY_FLAGS: Record<string, string> = {
  Brazil: '🇧🇷',
  Brasil: '🇧🇷',
  Argentina: '🇦🇷',
  Netherlands: '🇳🇱',
  Uruguai: '🇺🇾',
  Uruguay: '🇺🇾',
  Colombia: '🇨🇴',
  Chile: '🇨🇱',
  Peru: '🇵🇪',
  Paraguay: '🇵🇾',
  Ecuador: '🇪🇨',
  Venezuela: '🇻🇪',
  Bolivia: '🇧🇴',
  Portugal: '🇵🇹',
  Spain: '🇪🇸',
  Espanha: '🇪🇸',
  France: '🇫🇷',
  França: '🇫🇷',
  Italy: '🇮🇹',
  Itália: '🇮🇹',
  Germany: '🇩🇪',
  Alemanha: '🇩🇪',
  England: '🇬🇧',
  Inglaterra: '🇬🇧',
  Mexico: '🇲🇽',
  México: '🇲🇽',
  USA: '🇺🇸',
  'United States': '🇺🇸',
  Japan: '🇯🇵',
  Japão: '🇯🇵',
  'South Korea': '🇰🇷',
  'Coreia do Sul': '🇰🇷',
};

function getFlagEmoji(country: string | null | undefined): string {
  if (!country?.trim()) return '🏳️';
  const normalized = country.trim();
  return COUNTRY_FLAGS[normalized] ?? COUNTRY_FLAGS[Object.keys(COUNTRY_FLAGS).find((k) => k.toLowerCase() === normalized.toLowerCase()) ?? ''] ?? '🏳️';
}

function getAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
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

interface PlayerRowProps {
  player: Player;
  getPhotoUrl: (p: Player) => string;
}

export function PlayerRow({ player, getPhotoUrl }: PlayerRowProps) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = getPhotoUrl(player);
  const showPlaceholder = imgError || !player.photoUrl;
  const positionAbbrev = toPtBrAbbrev(player.position);
  const age = getAge(player.birthDate);
  const nationality = player.nationalitySecondary
    ? `${player.nationalityPrimary} / ${player.nationalitySecondary}`
    : player.nationalityPrimary;
  const flag = getFlagEmoji(player.nationalityPrimary);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(100px,1fr)_56px_96px_32px] gap-3 md:gap-4 p-3 md:px-4 md:py-3 rounded-xl border border-white/5 bg-card/60 hover:bg-card/80 transition-all duration-200 cursor-default"
      role="row"
    >
      {/* Jogador: Número + Foto + Nome (posição) */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-7 text-right font-mono text-sm text-muted-foreground tabular-nums shrink-0">
          {player.shirtNumber ?? '—'}
        </span>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
          {showPlaceholder ? (
            <span className="text-xs font-bold text-muted-foreground select-none">
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
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-foreground truncate">{player.name}</div>
          <div className="text-xs text-muted-foreground">{positionAbbrev}</div>
        </div>
      </div>

      {/* Nacionalidade - desktop */}
      <div className="hidden md:flex items-center gap-1.5 text-sm text-foreground-secondary min-w-0">
        <span className="text-base shrink-0" aria-hidden>{flag}</span>
        <span className="truncate">{nationality}</span>
      </div>

      {/* Altura - desktop */}
      <div className="hidden md:flex items-center justify-end text-sm text-foreground-secondary tabular-nums">—</div>

      {/* Nascimento - desktop */}
      <div className="hidden md:flex items-center text-sm text-foreground-secondary tabular-nums">
        {player.birthDate ? format(new Date(player.birthDate), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
      </div>

      {/* Idade - desktop */}
      <div className="hidden md:flex items-center justify-end text-sm text-foreground-secondary tabular-nums">
        {age ?? '—'}
      </div>

      {/* Mobile - empilhado */}
      <div className="flex md:hidden flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pl-[52px]">
        <span className="flex items-center gap-1">
          <span aria-hidden>{flag}</span>
          {nationality}
        </span>
        <span>Altura: —</span>
        <span>
          {player.birthDate ? format(new Date(player.birthDate), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
        </span>
        <span>{age != null ? `${age} anos` : '—'}</span>
      </div>
    </div>
  );
}
