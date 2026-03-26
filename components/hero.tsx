"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OverviewCard } from "@/components/overview-card"
import { Trophy, Star, Users, Shield } from "lucide-react"

const features = [
  { icon: Trophy, label: "20 Times", color: "text-blue-400" },
  { icon: Star, label: "500+ Jogadores", color: "text-[#6D5EF0]" },
  { icon: Users, label: "Milhares de Torcedores", color: "text-[#2FE6A6]" },
  { icon: Shield, label: "Notícias Exclusivas", color: "text-foreground-secondary" },
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
