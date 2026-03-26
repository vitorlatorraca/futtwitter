"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Mail, Github, Twitter } from "lucide-react"

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Meu Time", href: "/meu-time" },
  { label: "Notícias", href: "/dashboard" },
  { label: "Jogadores", href: "/dashboard" },
]

const companyLinks = [
  { label: "Sobre", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contact" },
  { label: "Termos", href: "/terms" },
]

const resourcesLinks = [
  { label: "Ajuda", href: "/support" },
  { label: "Comunidade", href: "/community" },
  { label: "Privacidade", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
]

const footerChips = [
  "20 Times",
  "Gratuito",
  "Comunidade ativa",
]

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05060A]/50 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="text-xl font-bold text-foreground mb-2">Brasileirão</div>
            </Link>
            <p className="text-sm text-foreground-secondary max-w-md">
              Sua paixão pelo Brasileirão em uma só plataforma. Avalie jogadores, leia notícias e conecte-se com torcedores.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {footerChips.map((chip, index) => (
                <Badge key={index} variant="default">
                  {chip}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="mailto:support@example.com" 
                className="text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* PRODUTO Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4">PRODUTO</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* COMPANY Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* RECURSOS Column */}
          <div>
            <h3 className="text-sm font-semibold mb-4">RECURSOS</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-foreground-secondary text-center">
            © {new Date().getFullYear()} Brasileirão. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
