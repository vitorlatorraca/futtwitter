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
  UserPlus,
  Shield,
  ArrowLeftRight,
  Calendar,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FuteAppLogo = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="w-8 h-8">
    <circle cx="16" cy="16" r="15" fill="none" stroke="white" strokeWidth="1.5" />
    <path
      d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 1.5c1.8 0 3.5.3 5.1.9-1.8 1.2-3.3 1.8-5.1 1.8s-3.3-.6-5.1-1.8c1.6-.6 3.3-.9 5.1-.9zm-7.5 2.6c2 1.6 4.5 2.6 7.5 2.6s5.5-1 7.5-2.6a12.5 12.5 0 013.5 6H25c-1.2 0-2.3-.5-3.3-1.5-1.2 1.2-2.5 1.8-3.7 1.8h-4c-1.2 0-2.5-.6-3.7-1.8C9.3 12.5 8.2 13 7 13H3.5a12.5 12.5 0 013.5-6zM3 16.5h4.5c1.5 0 3-.8 4.2-2.2 1.2 1.4 2.7 2.2 4.3 2.2h4c1.6 0 3.1-.8 4.3-2.2 1.2 1.4 2.7 2.2 4.2 2.2H29a12.5 12.5 0 01-.5 4H25c-1.5 0-3 .8-4.3 2.2-1.2-1.4-2.7-2.2-4.3-2.2h-4c-1.6 0-3.1.8-4.3 2.2C6.8 21.3 5.5 20.5 4 20.5H3.5a12.5 12.5 0 01-.5-4zm1.5 6H7c1.2 0 2.3.5 3.3 1.5 1.2-1.2 2.5-1.8 3.7-1.8h4c1.2 0 2.5.6 3.7 1.8 1-1 2.1-1.5 3.3-1.5h2.5a12.5 12.5 0 01-4 5c-1.5-1.4-3.5-2.3-5.5-2.3h-4c-2 0-4 .9-5.5 2.3a12.5 12.5 0 01-4-5z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

interface NavItem {
  label: string;
  subtitle?: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
  badgeColor?: string;
  isFuteApp?: boolean;
}

export default function Sidebar() {
  const { currentUser, unreadNotifications, unreadMessages, setComposeModalOpen } = useAppStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isCompact = useMediaQuery("(max-width: 1279px)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const location = useLocation();

  if (isMobile) return null;

  const topNav: NavItem[] = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Explorar", icon: Search, path: "/explore" },
  ];

  const futeAppNav: NavItem[] = [
    { label: "Meu Time", subtitle: "Seu clube do coração", icon: Shield, path: "/meu-time", isFuteApp: true },
    { label: "Vai e Vem", subtitle: "Transferências e rumores", icon: ArrowLeftRight, path: "/vai-e-vem", isFuteApp: true },
    { label: "Jogos", subtitle: "Agenda e resultados", icon: Calendar, path: "/jogos", isFuteApp: true },
  ];

  const bottomNav: NavItem[] = [
    { label: "Notificações", icon: Bell, path: "/notifications", badge: unreadNotifications || undefined },
    { label: "Mensagens", icon: Mail, path: "/messages", badge: unreadMessages || undefined },
    { label: "Perfil", icon: User, path: `/profile/${currentUser.handle}` },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path || (item.path === "/" && location.pathname === "/");
    const Icon = item.icon;

    return (
      <NavLink
        key={item.label}
        to={item.path}
        className={`group flex items-center rounded-full transition-colors py-3 px-3 relative ${
          isActive
            ? "hover:bg-[rgba(26,86,219,0.15)]"
            : "hover:bg-[rgba(26,86,219,0.1)]"
        }`}
        aria-label={item.label}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-x-accent rounded-r-full" />
        )}
        <div className="relative">
          <Icon
            className={`w-[26px] h-[26px] transition-colors ${
              isActive
                ? "text-x-accent stroke-[2.5]"
                : "stroke-[1.75] text-x-text-primary"
            }`}
            fill={isActive ? "rgba(26,86,219,0.2)" : "none"}
          />
          {item.badge && (
            <span
              className={`absolute -top-1.5 -right-1.5 text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${
                item.badgeColor || "bg-x-accent text-white"
              }`}
            >
              {typeof item.badge === "number" && item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </div>
        {!isCompact && (
          <div className="ml-5 flex flex-col">
            <span className={`text-xl leading-6 ${
              isActive ? "font-bold text-x-accent" : "font-normal text-x-text-primary"
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
          to="/"
          className="p-3 rounded-full hover:bg-[rgba(26,86,219,0.1)] transition-colors mb-0.5 flex items-center gap-2"
          aria-label="FuteApp Home"
        >
          <FuteAppLogo />
          {!isCompact && (
            <span className="font-brand text-2xl text-white tracking-wider">
              FuteApp
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

          {futeAppNav.map(renderNavItem)}

          {!isCompact && (
            <div className="mx-3 my-2 h-px bg-x-border" />
          )}
          {isCompact && (
            <div className="mx-auto my-2 w-8 h-px bg-x-border" />
          )}

          {bottomNav.map(renderNavItem)}

          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="group flex items-center rounded-full hover:bg-[rgba(26,86,219,0.1)] transition-colors py-3 px-3 w-full"
            aria-label="Mais"
          >
            <MoreHorizontal className="w-[26px] h-[26px] stroke-[1.75]" />
            {!isCompact && <span className="ml-5 text-xl leading-6">Mais</span>}
          </button>
        </nav>

        <button
          onClick={() => setComposeModalOpen(true)}
          className={`mt-4 brand-gradient text-white font-bold rounded-full hover:opacity-90 transition-opacity ${
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
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className={`flex items-center rounded-full hover:bg-[rgba(26,86,219,0.1)] transition-colors p-3 w-full ${
            isCompact ? "justify-center" : ""
          }`}
          aria-label="Menu da conta"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {!isCompact && (
            <>
              <div className="ml-3 flex-1 text-left min-w-0">
                <p className="text-[15px] font-bold leading-5 truncate">{currentUser.displayName}</p>
                <p className="text-[15px] text-x-text-secondary leading-5 truncate">@{currentUser.handle}</p>
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
                className="absolute bottom-full left-0 mb-2 w-[300px] bg-black rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-x-border z-50 py-3 overflow-hidden"
              >
                <button className="w-full text-left px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] text-[15px] flex items-center gap-3">
                  <UserPlus className="w-5 h-5" />
                  Adicionar conta existente
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] text-[15px] flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  Sair de @{currentUser.handle}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
