"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OverviewCard } from "@/components/overview-card"
import { Trophy, Star, Users, Shield } from "lucide-react"

const features = [
  { icon: Trophy, label: "20 Times", color: "text-floodlight" },
  { icon: Star, label: "500+ Jogadores", color: "text-ink-3" },
  { icon: Users, label: "Milhares de Torcedores", color: "text-slate" },
  { icon: Shield, label: "Notícias e análise", color: "text-foreground-secondary" },
]

export function Hero() {
  return (
    <section className="relative z-10">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 max-w-[1200px]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="w-fit glass-card border border-white/10 rounded-full px-3 py-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-floodlight"></div>
                <span className="text-xs font-medium text-foreground">A arquibancada digital</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
              O jornal que conversa com a sua torcida
            </h1>
            
            <p className="text-lg md:text-xl text-foreground-secondary max-w-xl leading-relaxed">
              Notícias com credibilidade editorial, debate de arquibancada e ferramentas para acompanhar o seu clube — numa experiência pensada para o futebol brasileiro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">Criar Conta Grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/login">Já tenho conta</Link>
              </Button>
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
            <OverviewCard />
          </div>
        </div>
      </div>
    </section>
  )
}
