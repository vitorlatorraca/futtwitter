import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const settingsItems = [
  { label: "Sua conta", description: "Veja informações sobre sua conta, baixe um arquivo dos seus dados ou saiba sobre opções de desativação." },
  { label: "FuteApp Pro", description: "Gerencie sua assinatura, funcionalidades e configurações do FuteApp Pro." },
  { label: "Segurança e acesso", description: "Gerencie a segurança da sua conta e acompanhe o uso." },
  { label: "Privacidade e segurança", description: "Gerencie quais informações você vê e compartilha no FuteApp." },
  { label: "Notificações", description: "Selecione os tipos de notificações que você recebe sobre suas atividades e interesses." },
  { label: "Acessibilidade e idiomas", description: "Gerencie como o conteúdo do FuteApp é exibido para você." },
  { label: "Recursos adicionais", description: "Confira outros locais com informações úteis sobre produtos e serviços do FuteApp." },
];

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Configurações</h1>
          <p className="text-[13px] text-x-text-secondary">@{currentUser.handle}</p>
        </div>
      </div>

      <div>
        {settingsItems.map((item) => (
          <button
            key={item.label}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left border-b border-x-border"
          >
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
