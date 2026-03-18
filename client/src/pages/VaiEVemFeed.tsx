import React, { useState } from "react";
import { ArrowLeftRight, ArrowRight, Plus, Lock } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { CreateTransferRumorDialog } from "../features/journalist-transfer-rumors/CreateTransferRumorDialog";

const filterTabs = ["Chegadas", "Saídas", "Rumores"] as const;
type FilterTab = typeof filterTabs[number];

type TransferStatus = "Confirmado" | "Rumor" | "Negociando" | "Cancelado";

interface Transfer {
  id: string;
  playerName: string;
  fromClub: string;
  toClub: string;
  fee: string;
  status: TransferStatus;
  type: "in" | "out" | "rumor";
}

const transfers: Transfer[] = [
  { id: "t1", playerName: "Memphis Depay", fromClub: "Atlético-MG", toClub: "Corinthians", fee: "Livre", status: "Confirmado", type: "in" },
  { id: "t2", playerName: "Paulinho", fromClub: "Al-Ahli", toClub: "Palmeiras", fee: "R$ 30M", status: "Confirmado", type: "in" },
  { id: "t3", playerName: "Gabriel Barbosa", fromClub: "Flamengo", toClub: "Cruzeiro", fee: "Livre", status: "Confirmado", type: "out" },
  { id: "t4", playerName: "Dudu", fromClub: "Palmeiras", toClub: "Cruzeiro", fee: "Livre", status: "Confirmado", type: "out" },
  { id: "t5", playerName: "Neymar Jr", fromClub: "Al-Hilal", toClub: "Santos", fee: "Livre", status: "Rumor", type: "rumor" },
  { id: "t6", playerName: "Suárez", fromClub: "Inter Miami", toClub: "Grêmio", fee: "R$ 5M", status: "Negociando", type: "rumor" },
  { id: "t7", playerName: "Thiago Silva", fromClub: "Fluminense", toClub: "São Paulo", fee: "Livre", status: "Rumor", type: "rumor" },
  { id: "t8", playerName: "Philippe Coutinho", fromClub: "Vasco", toClub: "Internacional", fee: "R$ 15M", status: "Cancelado", type: "rumor" },
  { id: "t9", playerName: "Endrick", fromClub: "Real Madrid", toClub: "Palmeiras", fee: "Empréstimo", status: "Negociando", type: "in" },
  { id: "t10", playerName: "Rony", fromClub: "Palmeiras", toClub: "Al-Rayyan", fee: "R$ 25M", status: "Confirmado", type: "out" },
];

const statusColors: Record<TransferStatus, string> = {
  "Confirmado": "bg-green-500/20 text-green-400 border-green-500/30",
  "Rumor": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Negociando": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Cancelado": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function VaiEVemFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Chegadas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const isJournalist = user?.isJournalist === true;

  const filteredTransfers = transfers.filter((t) => {
    if (activeFilter === "Chegadas") return t.type === "in";
    if (activeFilter === "Saídas") return t.type === "out";
    return t.type === "rumor";
  });

  return (
    <div>
      {/* Header with tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-x-accent" />
            <div>
              <h1 className="text-xl font-extrabold">Vai e Vem</h1>
              <p className="text-[13px] text-x-text-secondary">Transferências e rumores</p>
            </div>
          </div>

          {/* Botão: só jornalistas publicam */}
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
        <div className="flex">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="flex-1 py-3 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] font-medium"
            >
              <span className={activeFilter === tab ? "font-bold" : "text-x-text-secondary"}>
                {tab}
              </span>
              {activeFilter === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transfer Cards */}
      <div>
        {filteredTransfers.map((transfer) => (
          <div
            key={transfer.id}
            className="px-4 py-4 border-b border-x-border hover:bg-[rgba(231,233,234,0.03)] transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Player Avatar Placeholder */}
              <div className="w-12 h-12 rounded-full bg-x-surface flex items-center justify-center text-lg font-bold text-x-text-secondary flex-shrink-0">
                {transfer.playerName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-extrabold truncate">{transfer.playerName}</p>
                  <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[transfer.status]}`}>
                    {transfer.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-[14px]">
                  <span className="text-x-text-secondary">{transfer.fromClub}</span>
                  <ArrowRight className="w-4 h-4 text-x-accent flex-shrink-0" />
                  <span className="font-medium">{transfer.toClub}</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[13px] text-x-text-secondary">Valor:</span>
                  <span className="text-[13px] font-bold text-x-accent">{transfer.fee}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de criação — só renderiza para jornalistas */}
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
