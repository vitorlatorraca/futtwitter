import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, LogOut, User as UserIcon, Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUnreadCount } from '@/hooks/useNotifications';

/**
 * Tribuna top navigation.
 *
 * Anatomy per design_handoff_tribuna_rebrand/README.md ("Components" → a):
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  [T·]  tribuna           Feed  Vai e Vem  Meu Time  Jogos        │
 *   │        O JORNAL QUE CONVERSA   Perfil ●     [🔍 Buscar  ⌘K]  ⊙   │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Logo group: 36×36 ink rounded square with paper "T" + 10px floodlight dot
 * with 2px paper ring. Wordmark Bricolage 22/700, micro-label JBM 9 caps.
 *
 * Tabs: text-ink-3/font-500 → text-ink/font-600 when active. Active tab gets
 * a 3px floodlight underline 14px inset from the tab edges, 2px above the
 * nav's bottom border.
 *
 * Numeric badges: small pill in floodlight (or success for live), JBM 10 paper.
 *
 * Right side: search pill (paper-2 bg, full radius, magnifier + label + ⌘K
 * kbd hint) + 36×36 avatar with optional floodlight live dot bottom-right.
 *
 * Container: paper bg, line 1px bottom border, shadow-1, padding 14/20.
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: unread } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navLinks: Array<{
    label: string;
    href: string;
    testId: string;
    badge?: number;
    live?: boolean;
  }> = [
    { label: 'Feed', href: '/dashboard', testId: 'link-feed' },
    { label: 'Vai e Vem', href: '/vai-e-vem', testId: 'link-vai-e-vem' },
    { label: 'Meu Time', href: '/meu-time', testId: 'link-meu-time' },
    { label: 'Jogos', href: '/jogos', testId: 'link-jogos' },
    { label: 'Perfil', href: '/perfil', testId: 'link-perfil' },
  ];

  if (user.userType === 'JOURNALIST') {
    navLinks.push({ label: 'Painel Jornalista', href: '/jornalista', testId: 'link-jornalista' });
  }

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const unreadCount = unread?.count ?? 0;

  // ⌘K / Ctrl-K opens the search pill (forward focus to it)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('tribuna-search-trigger');
        el?.focus();
        el?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full bg-paper border-b border-line shadow-elev-1">
      <div className="container flex items-center justify-between gap-4 px-5 py-[14px] max-w-[1280px] mx-auto">
        {/* ── Logo group ─────────────────────────────────────────── */}
        <Link to="/dashboard" data-testid="link-logo" className="flex-shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer">
            {/* Monogram: 36×36 ink rounded square with paper letter + floodlight dot */}
            <div className="relative h-9 w-9 rounded-r-2 bg-ink flex items-center justify-center select-none">
              <span
                className="font-display text-[22px] text-paper leading-none"
                style={{ fontWeight: 800 }}
              >
                T
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-[3px] -right-[3px] h-2.5 w-2.5 rounded-full bg-floodlight ring-2 ring-paper"
              />
            </div>
            {/* Wordmark + micro-label (hidden on mobile to save space) */}
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-display text-[22px] text-ink"
                style={{ fontWeight: 700, letterSpacing: '-0.025em' }}
              >
                tribuna
              </span>
              <span
                className="font-mono text-[9px] text-slate mt-1"
                style={{ fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}
              >
                O jornal que conversa
              </span>
            </div>
          </div>
        </Link>

        {/* ── Tabs (centered, desktop only) ──────────────────────── */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                data-testid={link.testId}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 h-9 rounded-r-2 transition-colors',
                  active
                    ? 'text-ink'
                    : 'text-ink-3 hover:bg-paper-2 hover:text-ink'
                )}
                style={{
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-paper font-mono',
                      link.live ? 'bg-success' : 'bg-floodlight'
                    )}
                    style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}
                  >
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[14px] right-[14px] -bottom-[16px] h-[3px] rounded-sm bg-floodlight"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right side: search pill + avatar ───────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search pill (xl breakpoint+) */}
          <button
            id="tribuna-search-trigger"
            type="button"
            onClick={() => navigate('/explore')}
            className="hidden xl:flex items-center gap-2 px-3.5 h-9 w-[260px] bg-paper-2 hover:bg-line/40 rounded-full transition-colors text-slate text-left"
            aria-label="Buscar na Tribuna"
          >
            <Search className="h-4 w-4 stroke-[1.75] flex-shrink-0" />
            <span className="flex-1 text-[13px]">Buscar na Tribuna</span>
            <kbd
              className="hidden 2xl:inline-flex items-center px-1.5 py-0.5 rounded bg-paper border border-line text-slate-2 font-mono"
              style={{ fontSize: '10px', fontWeight: 500 }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Compact search icon (md..xl) */}
          <Link
            to="/explore"
            className="xl:hidden hidden md:flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper-2 transition-colors text-ink-3"
            aria-label="Buscar na Tribuna"
          >
            <Search className="h-5 w-5 stroke-[1.75]" />
          </Link>

          {/* Notifications icon — opens /notifications, badge = unread count */}
          <Link
            to="/notifications"
            className="hidden md:flex relative h-9 w-9 items-center justify-center rounded-full hover:bg-paper-2 transition-colors text-ink-3"
            aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações'}
          >
            <Bell className="h-5 w-5 stroke-[1.75]" />
            {unreadCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-floodlight text-paper font-mono ring-2 ring-paper"
                style={{ fontSize: '9px', fontWeight: 600 }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar with optional live dot */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative h-9 w-9 rounded-full overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-floodlight focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                aria-label="Abrir menu do usuário"
                data-testid="button-user-menu"
              >
                <Avatar className="h-9 w-9">
                  {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                  <AvatarFallback className="bg-ink text-paper font-semibold" style={{ fontSize: '13px' }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-floodlight ring-2 ring-paper"
                  />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-card border-line shadow-elev-2 rounded-r-3"
            >
              <DropdownMenuLabel className="space-y-0.5 pb-2">
                <div className="text-[14px] font-semibold text-ink">{user.name}</div>
                <div className="text-[12px] font-mono text-slate truncate">
                  @{user.handle ?? user.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-line" />
              <Link to="/perfil">
                <DropdownMenuItem className="cursor-pointer text-[14px] text-ink" data-testid="menu-profile">
                  <UserIcon className="mr-2 h-4 w-4 stroke-[1.75]" />
                  Perfil
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-line" />
              <DropdownMenuItem
                className="cursor-pointer text-[14px] text-error focus:text-error"
                onSelect={(e: Event) => {
                  e.preventDefault();
                  logout();
                }}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4 stroke-[1.75]" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu (≤ md) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu" className="text-ink-3">
                <Menu className="h-6 w-6 stroke-[1.75]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-paper border-line">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 pb-4 border-b border-line">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                    <AvatarFallback className="bg-ink text-paper font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-[12px] font-mono text-slate truncate">
                      @{user.handle ?? user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        data-testid={link.testId}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'w-full px-3 h-10 rounded-r-2 flex items-center text-[14px] transition-colors',
                          active
                            ? 'bg-ink text-paper font-semibold'
                            : 'text-ink font-medium hover:bg-paper-2'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-3 h-10 rounded-r-2 flex items-center justify-between text-[14px] text-ink font-medium hover:bg-paper-2 transition-colors"
                  >
                    <span>Notificações</span>
                    {unreadCount > 0 && (
                      <span
                        className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-floodlight text-paper font-mono"
                        style={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full px-3 h-10 rounded-r-2 flex items-center text-[14px] text-error font-medium hover:bg-error/10 transition-colors mt-2"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="h-4 w-4 stroke-[1.75] mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
