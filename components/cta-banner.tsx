"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaBanner() {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 py-16">
      <Card className="glass-card-hover">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Pronto para fazer parte da comunidade?
              </h2>
              <p className="text-foreground-secondary">
                Comece a avaliar jogadores e acompanhar seu time hoje. É grátis para começar.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/cadastro">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Ver dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
