import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Trophy, MapPin, Calendar, ChevronDown } from 'lucide-react';

interface HonourItem {
  name: string;
  count: number;
  years?: number[];
  yearsDisplay?: string;
  note?: string;
}

/** Flat honours (Corinthians) or categorized (Palmeiras) */
interface ClubHonoursFlat {
  coroas?: HonourItem[];
  continentais?: HonourItem[];
  nacionais?: HonourItem[];
  estaduais?: HonourItem[];
  total?: { name: string; count: number; description?: string };
}

interface CorinthiansClubData {
  id: string;
  name: string;
  founded: string;
  foundedLabel: string;
  city: string;
  country: string;
  stadium: {
    name: string;
    capacity: number;
    inaugurated?: number;
  };
  nicknames: string[];
  colors: { primary: string; secondary: string };
  titles?: {
    international: Array<{ name: string; count: number; years?: number[] }>;
    national: Array<{ name: string; count: number; years?: number[] }>;
    state: Array<{ name: string; count: number; years?: number[]; note?: string }>;
  };
  honours?: HonourItem[] | ClubHonoursFlat;
}

interface CorinthiansClubSectionProps {
  data: CorinthiansClubData;
  compact?: boolean;
}

const COLLAPSE_YEARS_THRESHOLD = 8;

function HonourCard({ item }: { item: HonourItem }) {
  const years = item.years ?? [];
  const yearsDisplay = item.yearsDisplay;
  const isLong = years.length > COLLAPSE_YEARS_THRESHOLD;
  const firstChunk = isLong ? years.slice(0, 5) : years;
  const restYears = isLong ? years.slice(5) : [];

  return (
    <div className="p-3 rounded-lg bg-background/60 border border-card-border/50 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{item.name}</span>
        <Badge variant="secondary" className="text-xs shrink-0">
          {item.count}x
        </Badge>
      </div>
      {yearsDisplay && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground">Anos:</span>
          <span className="text-xs font-mono bg-muted/80 px-1.5 py-0.5 rounded">{yearsDisplay}</span>
        </div>
      )}
      {!yearsDisplay && years.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground">Anos:</span>
          {firstChunk.map((y) => (
            <span key={y} className="text-xs font-mono bg-muted/80 px-1.5 py-0.5 rounded">
              {y}
            </span>
          ))}
          {restYears.length > 0 && (
            <Collapsible>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {restYears.map((y) => (
                    <span key={y} className="text-xs font-mono bg-muted/80 px-1.5 py-0.5 rounded">
                      {y}
                    </span>
                  ))}
                </div>
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  +{restYears.length} mais <ChevronDown className="h-3 w-3" />
                </button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      )}
      {item.note && (
        <p className="text-xs text-muted-foreground">{item.note}</p>
      )}
    </div>
  );
}

function isCategorizedHonours(h: HonourItem[] | ClubHonoursFlat | undefined): h is ClubHonoursFlat {
  if (!h || Array.isArray(h)) return false;
  return 'coroas' in h || 'continentais' in h || 'nacionais' in h || 'estaduais' in h;
}

const CATEGORY_LABELS: Record<string, string> = {
  coroas: 'Coroas',
  continentais: 'Continentais',
  nacionais: 'Nacionais',
  estaduais: 'Estaduais',
};

export function CorinthiansClubSection({ data, compact }: CorinthiansClubSectionProps) {
  const rawHonours = data.honours;
  const isCategorized = isCategorizedHonours(rawHonours);
  const honours: HonourItem[] = isCategorized ? [] : (rawHonours as HonourItem[] | undefined) ?? (() => {
    const t = data.titles;
    if (!t) return [];
    return [
      ...(t.international ?? []),
      ...(t.national ?? []),
      ...(t.state ?? []),
    ];
  })();

  const catHonours = isCategorized ? (rawHonours as ClubHonoursFlat) : null;
  const totalInfo = catHonours?.total;

  return (
    <Card
      className="overflow-hidden border-card-border"
      style={{
        background: `linear-gradient(135deg, ${data.colors.primary}22 0%, ${data.colors.secondary}11 100%)`,
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{ color: data.colors.primary }} />
          História & Títulos
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {data.foundedLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {data.stadium.name} ({data.stadium.capacity.toLocaleString('pt-BR')})
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.nicknames.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Apelidos</p>
            <p className="text-sm text-foreground">{data.nicknames.join(' • ')}</p>
          </div>
        )}

        {!compact && catHonours && (
          <div className="space-y-6">
            {(['coroas', 'continentais', 'nacionais', 'estaduais'] as const).map((key) => {
              const items = catHonours[key];
              if (!items || items.length === 0) return null;
              return (
                <div key={key}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {CATEGORY_LABELS[key] ?? key}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((item, i) => (
                      <HonourCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
            {totalInfo && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{totalInfo.name}</span>
                  <Badge variant="default" className="text-sm">{totalInfo.count}</Badge>
                </div>
                {totalInfo.description && (
                  <p className="text-xs text-muted-foreground mt-1">{totalInfo.description}</p>
                )}
              </div>
            )}
          </div>
        )}

        {!compact && honours.length > 0 && !catHonours && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Títulos (contagem verificada)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {honours.map((item, i) => (
                <HonourCard key={i} item={item} />
              ))}
            </div>
          </div>
        )}

        {compact && (honours.length > 0 || catHonours) && (
          <div className="flex flex-wrap gap-2">
            {(catHonours ? [
              ...(catHonours.coroas ?? []),
              ...(catHonours.continentais ?? []),
              ...(catHonours.nacionais ?? []),
              ...(catHonours.estaduais ?? []),
            ] : honours).slice(0, 6).map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {item.name} ({item.count}x)
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {data.id === 'palmeiras'
            ? 'Contagem conforme site oficial do Palmeiras, CBF, CONMEBOL e IFFHS. Verificado fev/2025.'
            : 'Contagem conforme site oficial do clube, CBF, CONMEBOL e FIFA. Mundial: 2000 (Copa Intercontinental), 2012 (Mundial FIFA). Fontes em corinthians.sources.json. Verificado fev/2025.'}
        </p>
      </CardContent>
    </Card>
  );
}
