"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05060A]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center h-7 w-7">
            {/* Logo estilo Brasileirão - círculo com ícone de futebol */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2FE6A6] to-[#2FE6A6]/80 rounded-full"></div>
            <div className="absolute top-0 right-0 h-3 w-3 bg-[#6D5EF0] rounded-full"></div>
            <span className="relative text-white text-xs font-bold">⚽</span>
          </div>
          <span className="text-xl font-bold text-foreground">Brasileirão</span>
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
