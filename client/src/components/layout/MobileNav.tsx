import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, ArrowLeftRight, Shield, User } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function MobileNav() {
  const { currentUser } = useAppStore();
  const location = useLocation();

  const items = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Calendar, path: "/jogos", label: "Jogos" },
    { icon: ArrowLeftRight, path: "/vai-e-vem", label: "Vai e Vem" },
    { icon: Shield, path: "/meu-time", label: "Meu Time" },
    { icon: User, path: `/profile/${currentUser.handle}`, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-x-border z-50 flex items-center justify-around px-4 py-2 md:hidden">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.path}
            className="relative p-3 flex flex-col items-center"
            aria-label={item.label}
          >
            <Icon
              className={`w-6 h-6 transition-colors ${
                isActive ? "text-x-accent stroke-[2.5]" : "stroke-[1.75] text-x-text-primary"
              }`}
              fill={isActive ? "rgba(26,86,219,0.2)" : "none"}
            />
            <span className={`text-[10px] mt-0.5 ${
              isActive ? "text-x-accent font-bold" : "text-x-text-secondary"
            }`}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
