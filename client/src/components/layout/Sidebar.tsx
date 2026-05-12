import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  Feather,
  LogOut,
  Shield,
  ArrowLeftRight,
  Calendar,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../../lib/auth-context";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useUnreadCount } from "../../hooks/useNotifications";

/**
 * Tribuna logo monogram for the sidebar — same anatomy as the navbar:
 * black square with paper "T" in Bricolage 800 and a floodlight dot.
 */
const TribunaLogo = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="w-8 h-8">
    <rect width="32" height="32" rx="6" fill="var(--ink)" />
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontFamily="var(--font-display)"
      fontSize="20"
      fontWeight="800"
      fill="var(--paper)"
    >
      T
    </text>
    <circle cx="25" cy="25" r="3.5" fill="var(--floodlight)" stroke="var(--paper)" strokeWidth="1.5" />
  </svg>
);

interface NavItem {
  label: string;
  subtitle?: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
  badgeColor?: string;
  isTribuna?: boolean;
}

export default function Sidebar() {
  const { currentUser, unreadMessages, setComposeModalOpen } = useAppStore();
  const { user: authUser, logout } = useAuth();
  const { data: unreadData } = useUnreadCount(!!authUser);
  const unreadCount = unreadData?.count ?? 0;
  const displayUser = authUser
    ? {
        displayName: authUser.name,
        handle: authUser.handle ?? "user",
        avatar: authUser.avatarUrl ?? "",
      }
    : currentUser ?? {
        displayName: "Usuário",
        handle: "user",
        avatar: "",
      };
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isCompact = useMediaQuery("(max-width: 1279px)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const location = useLocation();

  if (isMobile) return null;

  const topNav: NavItem[] = [
    { label: "Home", icon: Home, path: "/feed" },
    { label: "Explorar", icon: Search, path: "/explore" },
  ];

  const tribunaNav: NavItem[] = [
    { label: "Meu Time", subtitle: "Seu clube do coração", icon: Shield, path: "/meu-time", isTribuna: true },
    { label: "Vai e Vem", subtitle: "Transferências e rumores", icon: ArrowLeftRight, path: "/vai-e-vem", isTribuna: true },
    // { label: "Jogos", subtitle: "Agenda e resultados", icon: Calendar, path: "/jogos", isTribuna: true },
  ];

  const bottomNav: NavItem[] = [
    { label: "Notificações", icon: Bell, path: "/notifications", badge: unreadCount > 0 ? unreadCount : undefined },
    // { label: "Mensagens", icon: Mail, path: "/messages", badge: unreadMessages || undefined },
    { label: "Perfil", icon: User, path: `/profile/${displayUser.handle}` },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path || (item.path === "/feed" && location.pathname === "/feed");
    const Icon = item.icon;

    return (
      <NavLink
        key={item.label}
        to={item.path}
        className={`group flex items-center rounded-full transition-colors py-3 px-3 relative ${
          isActive
            ? "hover:bg-paper-2"
            : "hover:bg-paper-2"
        }`}
        aria-label={item.label}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink rounded-r-full" />
        )}
        <div className="relative">
          <Icon
            className={`w-[26px] h-[26px] transition-colors ${
              isActive
                ? "text-floodlight stroke-[2.5]"
                : "stroke-[1.75] text-x-text-primary"
            }`}
            fill={isActive ? "var(--floodlight)" : "none"}
            fillOpacity={isActive ? 0.15 : 1}
          />
          {item.badge && (
            <span
              className={`absolute -top-1.5 -right-1.5 text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${
                item.badgeColor || "bg-ink text-foreground"
              }`}
            >
              {typeof item.badge === "number" && item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </div>
        {!isCompact && (
          <div className="ml-5 flex flex-col">
            <span className={`text-xl leading-6 ${
              isActive ? "font-bold text-floodlight" : "font-normal text-x-text-primary"
            }`}>
              {item.label}
            </span>
            {item.subtitle && (
              <span className="text-[11px] text-x-text-secondary leading-4 mt-0.5">
                {item.subtitle}
              </span>
            )}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <header className={`sticky top-0 h-screen flex flex-col justify-between ${isCompact ? "w-[88px] items-center" : "w-[275px]"}`}>
      <div className={`flex flex-col ${isCompact ? "items-center" : "items-start"} py-1`}>
        <NavLink
          to="/feed"
          className="p-3 rounded-r-2 hover:bg-paper-2 transition-colors mb-0.5 flex items-center gap-2.5"
          aria-label="Tribuna — início"
        >
          <TribunaLogo />
          {!isCompact && (
            <span
              className="font-display text-[22px] text-ink"
              style={{ fontWeight: 700, letterSpacing: '-0.025em' }}
            >
              tribuna
            </span>
          )}
        </NavLink>

        <nav className="flex flex-col w-full gap-0.5">
          {topNav.map(renderNavItem)}

          {!isCompact && (
            <div className="mx-3 my-2 h-px bg-x-border" />
          )}
          {isCompact && (
            <div className="mx-auto my-2 w-8 h-px bg-x-border" />
          )}

          {tribunaNav.map(renderNavItem)}

          {!isCompact && (
            <div className="mx-3 my-2 h-px bg-x-border" />
          )}
          {isCompact && (
            <div className="mx-auto my-2 w-8 h-px bg-x-border" />
          )}

          {bottomNav.map(renderNavItem)}

          {/* <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="group flex items-center rounded-full hover:bg-paper-2 transition-colors py-3 px-3 w-full"
            aria-label="Mais"
          >
            <MoreHorizontal className="w-[26px] h-[26px] stroke-[1.75]" />
            {!isCompact && <span className="ml-5 text-xl leading-6">Mais</span>}
          </button> */}
        </nav>

        <button
          onClick={() => setComposeModalOpen(true)}
          className={`mt-4 bg-ink text-paper font-semibold rounded-full hover:bg-ink-2 transition-colors ${
            isCompact
              ? "w-[50px] h-[50px] flex items-center justify-center"
              : "w-[90%] py-3 text-[17px]"
          }`}
          aria-label="Postar"
        >
          {isCompact ? <Feather className="w-6 h-6" /> : "Postar"}
        </button>
      </div>

      <div className="mb-3 relative">
        {/* Só renderiza o botão de usuário se houver um usuário autenticado */}
        {!authUser && !currentUser ? null : (
          <>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className={`flex items-center rounded-full hover:bg-paper-2 transition-colors p-3 w-full ${
            isCompact ? "justify-center" : ""
          }`}
          aria-label="Menu da conta"
        >
          <img
            src={displayUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
            alt={displayUser.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {!isCompact && (
            <>
              <div className="ml-3 flex-1 text-left min-w-0">
                <p className="text-[15px] font-semibold text-ink leading-5 truncate">{displayUser.displayName}</p>
                <p className="text-[12px] font-mono text-slate leading-5 truncate">@{displayUser.handle}</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-x-text-secondary ml-2 flex-shrink-0" />
            </>
          )}
        </button>

        <AnimatePresence>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-[300px] bg-background rounded-2xl shadow-lg border border-x-border z-50 py-3 overflow-hidden"
              >
                <button
                  onClick={() => logout().catch(() => {})}
                  className="w-full text-left px-4 py-3 hover:bg-x-hover text-[15px] flex items-center gap-3"
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                  Sair de @{displayUser.handle}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
          </>
        )}
      </div>
    </header>
  );
}
