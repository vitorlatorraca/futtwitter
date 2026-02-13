import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navLinks = [
    { label: 'Feed', href: '/dashboard', testId: 'link-feed' },
    { label: 'Vai e Vem', href: '/vai-e-vem', testId: 'link-vai-e-vem' },
    { label: 'Meu Time', href: '/meu-time', testId: 'link-meu-time' },
    { label: 'Jogos', href: '/jogos', testId: 'link-jogos' },
    { label: 'Perfil', href: '/perfil', testId: 'link-perfil' },
  ];

  if (user.userType === 'JOURNALIST') {
    navLinks.push({ label: 'Painel Jornalista', href: '/jornalista', testId: 'link-jornalista' });
  }

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-card-border bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" data-testid="link-logo">
          <div className="group flex items-center gap-2 rounded-medium px-2 py-2 cursor-pointer transition-all duration-fast hover:bg-surface-elevated">
            <span className="text-xl">⚽</span>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-extrabold tracking-tight text-[15px] text-foreground group-hover:text-foreground">
                FUTTWITTER
              </span>
              <span className="text-[11px] text-foreground-secondary">
                Premium Futebol Editorial
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 rounded-medium border border-card-border bg-surface-glass px-1 py-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testId}
                className={cn(
                  "relative inline-flex items-center justify-center rounded-medium px-3 py-2 text-sm font-semibold text-foreground-secondary transition-all duration-fast",
                  "hover:text-foreground hover:bg-surface-elevated focus-ring",
                  active && "text-foreground bg-surface-elevated"
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-3 -bottom-[6px] h-[2px] rounded-full bg-primary transition-all duration-fast",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "hidden md:flex items-center gap-2 rounded-medium border border-card-border bg-surface-glass px-2 py-1.5",
                  "hover:bg-surface-elevated transition-all duration-fast focus-ring"
                )}
                aria-label="Abrir menu do usuário"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold hidden lg:inline text-foreground">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-foreground-secondary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-popover/80 backdrop-blur-md border-card-border">
              <DropdownMenuLabel className="space-y-1">
                <div className="text-sm font-semibold text-foreground">{user.name}</div>
                <div className="text-xs text-foreground-secondary truncate">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/perfil">
                <DropdownMenuItem className="cursor-pointer" data-testid="menu-profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-danger focus:text-danger"
                onSelect={(e: Event) => {
                  e.preventDefault();
                  logout();
                }}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu" className="focus-ring">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface-card border-card-border">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 pb-4 border-b border-card-border">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-foreground-secondary">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} data-testid={link.testId}>
                      <Button
                        variant={isActive(link.href) ? 'default' : 'ghost'}
                        className={`w-full justify-start font-semibold ${isActive(link.href) ? '' : 'hover:bg-surface-elevated'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
