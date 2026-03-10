import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, Shield, TrendingUp, Calendar, Newspaper, MessageSquare, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const categories = [
    { name: "Avaliações", icon: Star, percentage: 78 },
    { name: "Notícias", icon: Newspaper, percentage: 65 },
    { name: "Interações", icon: MessageSquare, percentage: 45 },
    { name: "Estatísticas", icon: BarChart3, percentage: 82 },
    { name: "Comunidade", icon: Users, percentage: 58 },
  ];

  const chips = [
    "20 Times do Brasileirão",
    "Avaliações em tempo real",
    "Notícias exclusivas",
    "Estatísticas detalhadas",
    "Comunidade ativa",
    "Plano gratuito disponível",
  ];

  const features = [
    { icon: Trophy, label: "20 Times", color: "text-primary" },
    { icon: Star, label: "500+ Jogadores", color: "text-primary" },
    { icon: Users, label: "Milhares de Torcedores", color: "text-foreground-secondary" },
    { icon: Shield, label: "Notícias Exclusivas", color: "text-foreground-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sem ruído de fundo — o body::before já tem o glow âmbar sutil */}

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Pill */}
              <div className="w-fit bg-primary/5 backdrop-blur-md border border-primary/20 rounded-full px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs font-medium text-foreground">All-in-one Brasileirão</span>
                </div>
              </div>

              {/* H1 — Barlow Condensed bold, editorial */}
              <h1 className="font-display font-bold uppercase tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground">
                Sua paixão pelo Brasileirão em uma só plataforma
              </h1>

              <p className="text-lg md:text-xl text-foreground-secondary max-w-xl leading-relaxed">
                Avalie jogadores, leia notícias exclusivas e conecte-se com milhares de torcedores apaixonados — tudo em um lugar, tudo no seu controle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/cadastro" data-testid="link-signup">Criar Conta Grátis</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/login" data-testid="link-login">Já tenho conta</Link>
                </Button>
              </div>

              <p className="text-xs text-foreground-muted">
                Sem cartão de crédito necessário
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-6 pt-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${feature.color}`} />
                      <span className="text-sm text-foreground-secondary">{feature.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column — Overview Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-surface-card border border-border rounded-xl shadow-card hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl font-display uppercase tracking-tight">Visão geral da plataforma</CardTitle>
                  <CardDescription className="text-foreground-secondary">
                    Atividade dos torcedores, avaliações e notícias — tudo em uma visão clara.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Mini Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-surface-elevated border border-border-subtle rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-xs text-foreground-secondary">Times</span>
                      </div>
                      <p className="text-lg font-semibold">20</p>
                    </div>

                    <div className="bg-surface-elevated border border-border-subtle rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs text-foreground-secondary">Ativos hoje</span>
                      </div>
                      <p className="text-lg font-semibold">1.2k</p>
                    </div>

                    <div className="bg-surface-elevated border border-border-subtle rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-foreground-secondary" />
                        <span className="text-xs text-foreground-secondary">Jogos hoje</span>
                      </div>
                      <p className="text-lg font-semibold">3</p>
                    </div>
                  </div>

                  {/* Categories with Progress */}
                  <div className="space-y-4">
                    {categories.map((category, index) => {
                      const Icon = category.icon
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-foreground-secondary" />
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <span className="text-sm text-foreground-secondary">
                              {category.percentage}%
                            </span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-border-subtle">
                            <div
                              className="h-full flex-1 transition-all"
                              style={{
                                width: `${category.percentage}%`,
                                background: 'hsl(38 90% 55%)'
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip, index) => (
                      <Badge key={index} variant="outline" className="text-foreground-secondary">
                        {chip}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 w-full" asChild>
                      <Link href="/dashboard">Ver dashboard</Link>
                    </Button>
                    <Button size="sm" className="flex-1 w-full" asChild>
                      <Link href="/cadastro">Começar agora</Link>
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-foreground-muted pt-2 leading-relaxed">
                    Nunca vendemos seus dados. Você controla o que compartilha, avalia ou exclui — a qualquer momento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Card className="bg-surface-card border border-border rounded-xl shadow-card hover:border-primary/20 transition-colors">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="font-display uppercase tracking-tight text-2xl md:text-3xl font-bold mb-2 text-foreground">
                    Pronto para fazer parte da comunidade?
                  </h2>
                  <p className="text-foreground-secondary">
                    Comece a avaliar jogadores e acompanhar seu time hoje. É grátis para começar.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/cadastro">Começar agora</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">Ver dashboard</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-subtle bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold uppercase tracking-tight text-lg text-foreground">FUTTWITTER</span>
              <span className="text-foreground-muted text-xs">· Premium Futebol Editorial</span>
            </div>
            <p className="text-sm text-foreground-muted">
              © 2024 Brasileirão. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-foreground-secondary">
              <a href="#" className="hover:text-foreground transition-colors">Sobre</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
