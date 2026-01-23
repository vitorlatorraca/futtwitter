import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navLinks = [
    { label: 'Feed', href: '/dashboard', testId: 'link-feed' },
    { label: 'Meu Time', href: '/meu-time', testId: 'link-meu-time' },
    { label: 'Perfil', href: '/perfil', testId: 'link-perfil' },
  ];

  if (user.userType === 'JOURNALIST') {
    navLinks.push({ label: 'Painel Jornalista', href: '/jornalista', testId: 'link-jornalista' });
  }

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-card-border bg-surface-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" data-testid="link-logo">
          <div className="flex items-center gap-2 text-xl font-display font-bold tracking-tight rounded-medium px-3 py-2 cursor-pointer transition-all duration-fast hover:bg-surface-elevated hover:text-primary">
            <span className="text-2xl">⚽</span>
            <span className="hidden sm:inline">FUTTWITTER</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-surface-card rounded-medium p-1 border border-card-border">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} data-testid={link.testId}>
              <Button
                variant={isActive(link.href) ? 'default' : 'ghost'}
                className={`font-semibold ${isActive(link.href) ? '' : 'hover:bg-surface-elevated'}`}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-medium bg-surface-elevated border border-card-border">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold hidden lg:inline text-foreground">{user.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            className="hidden md:flex hover:bg-danger/10 hover:text-danger"
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-surface-card border-card-border">
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
