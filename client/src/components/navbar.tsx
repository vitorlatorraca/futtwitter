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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-black/90 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" data-testid="link-logo">
          <div className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-full hover:bg-white/5 transition-colors">
            <span className="text-xl">⚽</span>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-[15px] text-foreground tracking-tight">
                FUTTWITTER
              </span>
              <span className="text-[10px] text-foreground-secondary">
                Premium Futebol Editorial
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testId}
                className={cn(
                  "relative flex items-center justify-center px-4 h-14 text-sm font-bold transition-colors",
                  "hover:bg-white/5",
                  active ? "text-foreground" : "text-foreground-secondary"
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 inset-x-4 h-1 rounded-full bg-primary"
                  />
                )}
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
                  "hidden md:flex items-center gap-2 rounded-full px-3 py-1.5",
                  "hover:bg-white/5 transition-colors"
                )}
                aria-label="Abrir menu do usuário"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold border border-primary/30">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold hidden lg:inline text-foreground">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-foreground-secondary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-[#16181C] border-border shadow-xl rounded-2xl">
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
            <SheetContent side="right" className="w-72 bg-surface-card border-border">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
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
