import React from "react";
import { ArrowLeft, ChevronRight, User, Shield, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

export default function Settings() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.userType === "ADMIN";

  const items = [
    {
      icon: User,
      label: "Sua conta",
      description: "Informações da conta, solicitação de verificação como jornalista.",
      path: "/settings/conta",
    },
    {
      icon: Shield,
      label: "Privacidade e segurança",
      description: "Gerencie quais informações você vê e compartilha no FuteApp.",
      path: "/settings/privacidade",
    },
    ...(isAdmin
      ? [
          {
            icon: ShieldCheck,
            label: "Painel Admin",
            description: "Gerencie solicitações de jornalistas e usuários.",
            path: "/settings/admin",
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-x-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Configurações</h1>
          <p className="text-[13px] text-x-text-secondary">@{authUser?.handle}</p>
        </div>
      </div>

      <div>
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left border-b border-x-border"
          >
            <item.icon className="w-5 h-5 text-x-text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[15px] font-medium">{item.label}</p>
              <p className="text-[13px] text-x-text-secondary mt-0.5 leading-4">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-x-text-secondary flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
