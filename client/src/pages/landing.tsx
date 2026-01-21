import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
    { icon: Trophy, label: "20 Times", color: "text-blue-400" },
    { icon: Star, label: "500+ Jogadores", color: "text-[#6D5EF0]" },
    { icon: Users, label: "Milhares de Torcedores", color: "text-[#2FE6A6]" },
    { icon: Shield, label: "Notícias Exclusivas", color: "text-foreground-secondary" },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] relative">
      {/* Background effects */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 20% 30%, rgba(109, 94, 240, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 80% 70%, rgba(47, 230, 166, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 50% 120%, rgba(0, 0, 0, 0.4) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="w-fit bg-white/4 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#2FE6A6]"></div>
                  <span className="text-xs font-medium text-foreground">All-in-one Brasileirão</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
                Sua paixão pelo Brasileirão em uma só plataforma
              </h1>
              
              <p className="text-lg md:text-xl text-foreground-secondary max-w-xl leading-relaxed">
                Avalie jogadores, leia notícias exclusivas e conecte-se com milhares de torcedores apaixonados — tudo em um lugar, tudo no seu controle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cadastro" data-testid="link-signup">
                  <Button size="lg" className="w-full sm:w-auto bg-[#6D5EF0] text-white hover:bg-[#7D6EFF]">
                    Criar Conta Grátis
                  </Button>
                </Link>
                <Link href="/login" data-testid="link-login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 bg-transparent hover:bg-white/5">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs text-foreground-secondary">
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
            
            {/* Right Column - Overview Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/6 transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">Visão geral da plataforma</CardTitle>
                  <CardDescription className="text-foreground-secondary">
                    Atividade dos torcedores, avaliações e notícias — tudo em uma visão clara.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Mini Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-4 w-4 text-foreground-secondary" />
                        <span className="text-xs text-foreground-secondary">Times</span>
                      </div>
                      <p className="text-lg font-semibold">20</p>
                    </div>
                    
                    <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-[#2FE6A6]" />
                        <span className="text-xs text-foreground-secondary">Ativos hoje</span>
                      </div>
                      <p className="text-lg font-semibold">1.2k</p>
                    </div>
                    
                    <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-lg p-3">
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
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                            <div 
                              className="h-full flex-1 transition-all"
                              style={{ 
                                width: `${category.percentage}%`,
                                background: 'linear-gradient(90deg, #2FE6A6 0%, #6D5EF0 100%)'
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
                      <Badge key={index} variant="default" className="border-white/10 bg-white/5 text-foreground-secondary">
                        {chip}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-white/20 bg-transparent hover:bg-white/5">
                        Ver dashboard
                      </Button>
                    </Link>
                    <Link href="/cadastro" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-white/20 bg-transparent hover:bg-white/5">
                        Começar agora
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Disclaimer */}
                  <p className="text-xs text-foreground-secondary pt-2 leading-relaxed">
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
          <Card className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/6 transition-all">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                    Pronto para fazer parte da comunidade?
                  </h2>
                  <p className="text-foreground-secondary">
                    Comece a avaliar jogadores e acompanhar seu time hoje. É grátis para começar.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/cadastro">
                    <Button size="lg" className="bg-[#6D5EF0] text-white hover:bg-[#7D6EFF]">
                      Começar agora
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="border-white/20 bg-transparent hover:bg-white/5">
                      Ver dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05060A]/50 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground-secondary">
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
