"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Trophy, 
  TrendingUp, 
  Calendar,
  Star,
  Users,
  Newspaper,
  MessageSquare,
  BarChart3
} from "lucide-react"

const categories = [
  { name: "Avaliações", icon: Star, percentage: 78 },
  { name: "Notícias", icon: Newspaper, percentage: 65 },
  { name: "Interações", icon: MessageSquare, percentage: 45 },
  { name: "Estatísticas", icon: BarChart3, percentage: 82 },
  { name: "Comunidade", icon: Users, percentage: 58 },
]

const chips = [
  "20 Times do Brasileirão",
  "Avaliações em tempo real",
  "Notícias exclusivas",
  "Estatísticas detalhadas",
  "Comunidade ativa",
  "Plano gratuito disponível",
]

export function OverviewCard() {
  return (
    <Card className="w-full max-w-md glass-card-hover">
      <CardHeader>
        <CardTitle className="text-xl">Visão geral da plataforma</CardTitle>
        <CardDescription>
          Atividade dos torcedores, avaliações e notícias — tudo em uma visão clara.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mini Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-foreground-secondary" />
              <span className="text-xs text-foreground-secondary">Times</span>
            </div>
            <p className="text-lg font-semibold">20</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#2FE6A6]" />
              <span className="text-xs text-foreground-secondary">Ativos hoje</span>
            </div>
            <p className="text-lg font-semibold">1.2k</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
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
                <Progress value={category.percentage} />
              </div>
            )
          })}
        </div>
        
        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <Badge key={index} variant="default">
              {chip}
            </Badge>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/dashboard">Ver dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/cadastro">Começar agora</Link>
          </Button>
        </div>
        
        {/* Disclaimer */}
        <p className="text-xs text-foreground-secondary pt-2 leading-relaxed">
          Nunca vendemos seus dados. Você controla o que compartilha, avalia ou exclui — a qualquer momento.
        </p>
      </CardContent>
    </Card>
  )
}
