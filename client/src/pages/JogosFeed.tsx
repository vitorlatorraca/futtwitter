import React, { useState } from "react";
import { Calendar } from "lucide-react";

const dateTabs = ["Ontem", "Hoje", "Amanhã", "Qui", "Sex", "Sáb", "Dom"] as const;
const compTabs = ["Todos", "Brasileirão", "Copa do Brasil", "Libertadores", "Champions"] as const;
const timeTabs = ["Hoje", "Esta Semana", "Resultados", "Ao Vivo"] as const;

type MatchStatus = "live" | "finished" | "upcoming";

interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  time: string;
  competition: string;
  round: string;
  stadium: string;
  status: MatchStatus;
  minute?: string;
}

const matches: MatchData[] = [
  { id: "m1", homeTeam: "Corinthians", awayTeam: "Palmeiras", homeScore: 2, awayScore: 1, time: "16:00", competition: "Brasileirão", round: "Rodada 22", stadium: "Neo Química Arena", status: "live", minute: "67'" },
  { id: "m2", homeTeam: "Flamengo", awayTeam: "São Paulo", homeScore: 0, awayScore: 0, time: "18:30", competition: "Brasileirão", round: "Rodada 22", stadium: "Maracanã", status: "live", minute: "23'" },
  { id: "m3", homeTeam: "Botafogo", awayTeam: "Fluminense", homeScore: 3, awayScore: 2, time: "16:00", competition: "Brasileirão", round: "Rodada 21", stadium: "Nilton Santos", status: "finished" },
  { id: "m4", homeTeam: "Santos", awayTeam: "Grêmio", homeScore: 1, awayScore: 1, time: "19:00", competition: "Brasileirão", round: "Rodada 21", stadium: "Vila Belmiro", status: "finished" },
  { id: "m5", homeTeam: "Palmeiras", awayTeam: "Boca Juniors", homeScore: null, awayScore: null, time: "21:30", competition: "Libertadores", round: "Quartas de Final", stadium: "Allianz Parque", status: "upcoming" },
  { id: "m6", homeTeam: "Atlético-MG", awayTeam: "Cruzeiro", homeScore: null, awayScore: null, time: "20:00", competition: "Copa do Brasil", round: "Semifinal", stadium: "Arena MRV", status: "upcoming" },
  { id: "m7", homeTeam: "Real Madrid", awayTeam: "Barcelona", homeScore: null, awayScore: null, time: "17:00", competition: "Champions", round: "Grupo A", stadium: "Santiago Bernabéu", status: "upcoming" },
  { id: "m8", homeTeam: "Vasco", awayTeam: "Internacional", homeScore: 2, awayScore: 0, time: "16:00", competition: "Brasileirão", round: "Rodada 21", stadium: "São Januário", status: "finished" },
];

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  live: { label: "AO VIVO", className: "text-red-500" },
  finished: { label: "Encerrado", className: "text-x-text-secondary" },
  upcoming: { label: "Em Breve", className: "text-x-accent" },
};

export default function JogosFeed() {
  const [activeTimeTab, setActiveTimeTab] = useState<typeof timeTabs[number]>("Hoje");
  const [activeComp, setActiveComp] = useState<typeof compTabs[number]>("Todos");

  const filteredMatches = matches.filter((m) => {
    if (activeComp !== "Todos" && m.competition !== activeComp) return false;
    if (activeTimeTab === "Ao Vivo") return m.status === "live";
    if (activeTimeTab === "Resultados") return m.status === "finished";
    return true;
  });

  const liveMatches = filteredMatches.filter((m) => m.status === "live");
  const otherMatches = filteredMatches.filter((m) => m.status !== "live");

  return (
    <div>
      {/* Header with tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-x-accent" />
          <h1 className="text-xl font-extrabold">Jogos</h1>
        </div>
        <div className="flex">
          {timeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTimeTab(tab)}
              className="flex-1 py-3 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] font-medium"
            >
              <span className={activeTimeTab === tab ? "font-bold" : "text-x-text-secondary"}>
                {tab}
              </span>
              {activeTimeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Competition filters */}
      <div className="px-4 py-3 border-b border-x-border overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {compTabs.map((comp) => (
            <button
              key={comp}
              onClick={() => setActiveComp(comp)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                activeComp === comp
                  ? "bg-x-accent text-white"
                  : "bg-x-surface text-x-text-secondary hover:bg-x-search-bg"
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Live matches section */}
      {liveMatches.length > 0 && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 pulse-live" />
            <span className="text-[14px] font-extrabold text-red-500">AO VIVO</span>
          </div>
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Other matches */}
      <div className="px-4 py-3">
        {otherMatches.length > 0 ? (
          <div className="space-y-3">
            {otherMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-x-text-secondary text-[15px]">Nenhum jogo encontrado para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: MatchData }) {
  const status = statusConfig[match.status];

  return (
    <div className="border border-x-border rounded-2xl p-4 mb-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors cursor-pointer">
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {match.status === "live" && (
            <div className="w-2 h-2 rounded-full bg-red-500 pulse-live" />
          )}
          <span className={`text-[12px] font-bold ${status.className}`}>
            {match.status === "live" ? `${status.label} · ${match.minute}` : status.label}
          </span>
        </div>
        <span className="text-[12px] text-x-text-secondary">{match.competition}</span>
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[15px] font-bold">{match.homeTeam}</p>
        </div>
        <div className="px-4 text-center min-w-[80px]">
          {match.homeScore !== null && match.awayScore !== null ? (
            <p className="text-xl font-extrabold">
              {match.homeScore} <span className="text-x-text-secondary mx-1">-</span> {match.awayScore}
            </p>
          ) : (
            <p className="text-lg font-bold text-x-text-secondary">{match.time}</p>
          )}
        </div>
        <div className="flex-1 text-right">
          <p className="text-[15px] font-bold">{match.awayTeam}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 flex items-center justify-between text-[12px] text-x-text-secondary">
        <span>{match.round}</span>
        <span>{match.stadium}</span>
      </div>
    </div>
  );
}
