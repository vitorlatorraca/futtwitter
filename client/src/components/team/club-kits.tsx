import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt } from 'lucide-react';
import type { Team } from '@shared/schema';

interface Kit {
  type: 'Home' | 'Away' | 'Third';
  primaryColor: string;
  secondaryColor: string;
  pattern?: string;
}

interface ClubKitsProps {
  team: Team;
  kits?: Kit[];
}

export function ClubKits({ team, kits }: ClubKitsProps) {
  // Default kits based on team colors if not provided
  const defaultKits: Kit[] = kits || [
    {
      type: 'Home',
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
    },
    {
      type: 'Away',
      primaryColor: '#FFFFFF',
      secondaryColor: team.primaryColor,
    },
    {
      type: 'Third',
      primaryColor: '#000000',
      secondaryColor: team.secondaryColor,
    },
  ];

  const renderKit = (kit: Kit) => {
    return (
      <Card
        key={kit.type}
        className="bg-card/60 backdrop-blur-sm border-card-border hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="relative w-full aspect-[3/4] flex items-center justify-center">
            {/* Kit Shirt */}
            <div
              className="relative w-32 h-40 rounded-lg shadow-lg transform group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${kit.primaryColor} 0%, ${kit.secondaryColor} 100%)`,
                border: `2px solid ${kit.secondaryColor}40`,
              }}
            >
              {/* Shirt Pattern - Simple stripes for now */}
              {kit.pattern === 'stripes' && (
                <div className="absolute inset-0 flex flex-col">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{
                        backgroundColor: i % 2 === 0 ? kit.primaryColor : kit.secondaryColor,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Jersey Number Placeholder */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: kit.type === 'Home' ? kit.secondaryColor : kit.primaryColor,
                    color: kit.type === 'Home' ? kit.primaryColor : kit.secondaryColor,
                  }}
                >
                  #
                </div>
              </div>

              {/* Sponsor Placeholder */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div
                  className="px-3 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: kit.type === 'Home' ? kit.secondaryColor : kit.primaryColor,
                    color: kit.type === 'Home' ? kit.primaryColor : kit.secondaryColor,
                    opacity: 0.8,
                  }}
                >
                  {team.shortName}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="font-semibold text-foreground">{kit.type}</p>
            <p className="text-xs text-muted-foreground mt-1">Temporada 2024</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Shirt className="h-5 w-5 text-primary" />
          Camisas do Clube
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {defaultKits.map(renderKit)}
        </div>
        {/* TODO: Adicionar funcionalidade de seleção de kit e visualização detalhada */}
      </CardContent>
    </Card>
  );
}
