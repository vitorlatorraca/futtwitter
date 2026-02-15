import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTeamCrest } from '@/lib/teamCrests';
import type { ClubConfig } from '@/features/meu-time/types';

const TAB_ITEMS: { value: string; label: string }[] = [
  { value: 'overview', label: 'Visão Geral' },
  { value: 'classificacao', label: 'Classificação' },
  { value: 'news', label: 'Notícias' },
  { value: 'matches', label: 'Jogos' },
  { value: 'performance', label: 'Estatísticas' },
  { value: 'vai-e-vem', label: 'Vai e Vem' },
  { value: 'comunidade', label: 'Comunidade' },
];

interface TeamTabsProps {
  clubConfig?: ClubConfig | null;
  currentPosition?: number | null;
}

export function TeamTabs({ clubConfig, currentPosition }: TeamTabsProps) {
  const crestUrl = clubConfig ? getTeamCrest(clubConfig.teamId) : '/assets/crests/default.png';

  return (
    <div className="space-y-3">
      {clubConfig && (
        <div className="flex items-center gap-3">
          <img
            src={crestUrl}
            alt={`Escudo ${clubConfig.displayName}`}
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white truncate">
              {clubConfig.displayName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-0.5">
              {currentPosition != null && (
                <span className="font-semibold text-white tabular-nums">{currentPosition}º</span>
              )}
              {clubConfig.league && (
                <span className="truncate">{clubConfig.league}</span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        <TabsList className="w-max min-w-full justify-start gap-1 p-1 rounded-full bg-white/5 border border-white/10">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="font-semibold rounded-full px-4 py-2 text-sm data-[state=active]:bg-emerald-500 data-[state=active]:text-black data-[state=inactive]:hover:border data-[state=inactive]:hover:border-white/20 data-[state=inactive]:text-zinc-400"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
}
