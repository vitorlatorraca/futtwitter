import React, { useState } from "react";
import { ArrowLeftRight, ArrowRight, Plus, Lock } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { CreateTransferRumorDialog } from "../features/journalist-transfer-rumors/CreateTransferRumorDialog";
import { useTransferRumors, type TransferRumorStatus, type TransferRumorItem } from "../features/journalist-transfer-rumors/api";

// Tabs mapeados para status da API
const filterTabs = [
  { label: "Todos", status: "ALL" },
  { label: "Rumores", status: "RUMOR" },
  { label: "Negociando", status: "NEGOTIATING" },
  { label: "Fechados", status: "DONE" },
] as const;

type FilterKey = (typeof filterTabs)[number]["status"];

const STATUS_LABELS: Record<TransferRumorStatus, string> = {
  RUMOR: "Rumor",
  NEGOTIATING: "Negociando",
  DONE: "Fechado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<TransferRumorStatus, string> = {
  RUMOR: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  NEGOTIATING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DONE: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

function formatFee(item: TransferRumorItem): string {
  if (!item.feeAmount) return "Valor não divulgado";
  const currency = item.feeCurrency ?? "BRL";
  const symbol = currency === "BRL" ? "R$" : currency === "EUR" ? "€" : "$";
  return `${symbol} ${Number(item.feeAmount).toLocaleString("pt-BR")}M`;
}

function TransferCard({ item }: { item: TransferRumorItem }) {
  const initial = item.player.name.charAt(0).toUpperCase();
  return (
    <div className="px-4 py-4 border-b border-x-border hover:bg-[rgba(231,233,234,0.03)] transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar do jogador */}
        {item.player.photoUrl ? (
          <img
            src={item.player.photoUrl}
            alt={item.player.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-x-surface"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-x-surface flex items-center justify-center text-lg font-bold text-x-text-secondary flex-shrink-0">
            {initial}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-extrabold truncate">{item.player.name}</p>
            <span
              className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[item.status]}`}
            >
              {STATUS_LABELS[item.status]}
            </span>
          </div>

          {/* De → Para */}
          <div className="flex items-center gap-2 mt-1.5 text-[14px]">
            <span className="text-x-text-secondary truncate">{item.fromTeam?.name ?? "—"}</span>
            <ArrowRight className="w-4 h-4 text-x-accent flex-shrink-0" />
            <span className="font-medium truncate">{item.toTeam?.name ?? "—"}</span>
          </div>

          {/* Valor */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[13px] text-x-text-secondary">Valor:</span>
            <span className="text-[13px] font-bold text-x-accent">{formatFee(item)}</span>
          </div>

          {/* Fonte (opcional) */}
          {item.sourceName && (
            <p className="text-[12px] text-x-text-secondary mt-1">Fonte: {item.sourceName}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton para carregamento
function SkeletonCard() {
  return (
    <div className="px-4 py-4 border-b border-x-border">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-x-surface animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-x-surface animate-pulse rounded w-2/3" />
          <div className="h-3 bg-x-surface animate-pulse rounded w-1/2" />
          <div className="h-3 bg-x-surface animate-pulse rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function VaiEVemFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  const isJournalist = user?.isJournalist === true;

  const { data: rumors, isLoading, isError } = useTransferRumors(activeFilter);

  return (
    <div>
      {/* Header com tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-x-accent" />
            <div>
              <h1 className="text-xl font-extrabold">Vai e Vem</h1>
              <p className="text-[13px] text-x-text-secondary">Transferências e rumores</p>
            </div>
          </div>

          {/* Botão: só jornalistas */}
          {isJournalist ? (
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1.5 bg-x-accent hover:bg-x-accent-hover text-white text-[13px] font-bold px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nova negociação
            </button>
          ) : user ? (
            <div
              className="flex items-center gap-1.5 text-x-text-secondary text-[12px] flex-shrink-0"
              title="Apenas jornalistas verificados podem publicar negociações"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Só jornalistas</span>
            </div>
          ) : null}
        </div>

        {/* Tabs de filtro */}
        <div className="flex">
          {filterTabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setActiveFilter(tab.status)}
              className="flex-1 py-3 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[14px] font-medium"
            >
              <span className={activeFilter === tab.status ? "font-bold" : "text-x-text-secondary"}>
                {tab.label}
              </span>
              {activeFilter === tab.status && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
      ) : isError ? (
        <div className="px-4 py-12 text-center text-x-text-secondary">
          <p className="text-[15px]">Erro ao carregar negociações.</p>
          <p className="text-[13px] mt-1">Tente novamente mais tarde.</p>
        </div>
      ) : !rumors || rumors.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <ArrowLeftRight className="w-10 h-10 text-x-text-secondary mx-auto mb-3 opacity-50" />
          <p className="text-[15px] font-semibold text-x-text-secondary">
            Nenhuma negociação ainda
          </p>
          <p className="text-[13px] text-x-text-secondary mt-1">
            {isJournalist
              ? "Seja o primeiro a publicar uma negociação!"
              : "Em breve jornalistas vão publicar negociações aqui."}
          </p>
        </div>
      ) : (
        <div>
          {rumors.map((item) => (
            <TransferCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Dialog — só para jornalistas */}
      {isJournalist && (
        <CreateTransferRumorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
