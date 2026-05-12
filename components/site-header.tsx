"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-paper font-display text-sm font-extrabold"
            aria-hidden
          >
            T
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-ink">tribuna</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/meu-time" 
            className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
          >
            Meu Time
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex">
            <Link href="/cadastro">Começar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
