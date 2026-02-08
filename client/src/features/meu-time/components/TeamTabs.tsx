import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TAB_ITEMS: { value: string; label: string }[] = [
  { value: 'overview', label: 'Visão Geral' },
  { value: 'news', label: 'Notícias' },
  { value: 'matches', label: 'Jogos' },
  { value: 'performance', label: 'Estatísticas' },
  { value: 'social', label: 'Comunidade' },
];

export function TeamTabs() {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <TabsList className="w-max min-w-full justify-start">
        {TAB_ITEMS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="font-semibold">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
