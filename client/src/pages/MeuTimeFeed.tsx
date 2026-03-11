import React, { useState } from "react";
import { Shield, Users, BarChart2, Calendar, ChevronRight } from "lucide-react";

const tabs = ["Resumo", "Elenco", "Estatísticas", "Jogos"] as const;
type Tab = typeof tabs[number];

const brazilianTeams = [
  { id: "corinthians", name: "Corinthians", badge: "🏴" },
  { id: "palmeiras", name: "Palmeiras", badge: "🟢" },
  { id: "flamengo", name: "Flamengo", badge: "🔴" },
  { id: "sao-paulo", name: "São Paulo", badge: "⚪" },
  { id: "santos", name: "Santos", badge: "⚫" },
  { id: "botafogo", name: "Botafogo", badge: "⭐" },
  { id: "fluminense", name: "Fluminense", badge: "🟤" },
  { id: "vasco", name: "Vasco", badge: "🏴" },
  { id: "gremio", name: "Grêmio", badge: "🔵" },
  { id: "internacional", name: "Internacional", badge: "🔴" },
  { id: "atletico-mg", name: "Atlético-MG", badge: "⚫" },
  { id: "cruzeiro", name: "Cruzeiro", badge: "🔵" },
];

const lastMatches = [
  { opponent: "Palmeiras", score: "2-1", result: "W" as const, comp: "Brasileirão" },
  { opponent: "São Paulo", score: "0-0", result: "D" as const, comp: "Brasileirão" },
  { opponent: "Flamengo", score: "1-3", result: "L" as const, comp: "Copa do Brasil" },
  { opponent: "Santos", score: "2-0", result: "W" as const, comp: "Brasileirão" },
  { opponent: "Botafogo", score: "1-0", result: "W" as const, comp: "Brasileirão" },
];

const squadPlayers = [
  { name: "Cássio", position: "GOL", number: 12 },
  { name: "Fagner", position: "LAD", number: 23 },
  { name: "Gil", position: "ZAG", number: 4 },
  { name: "Félix Torres", position: "ZAG", number: 3 },
  { name: "Hugo", position: "LAE", number: 6 },
  { name: "Raniele", position: "VOL", number: 14 },
  { name: "Breno Bidon", position: "MEI", number: 27 },
  { name: "Rodrigo Garro", position: "MEI", number: 10 },
  { name: "Romero", position: "ATA", number: 11 },
  { name: "Yuri Alberto", position: "ATA", number: 9 },
  { name: "Memphis Depay", position: "ATA", number: 94 },
];

const teamStats = {
  position: "3°",
  points: 40,
  wins: 12,
  draws: 4,
  losses: 5,
  goalsFor: 34,
  goalsAgainst: 22,
  matches: 21,
};

const nextMatch = {
  opponent: "Palmeiras",
  date: "Sábado, 15 de Março",
  time: "16:00",
  competition: "Brasileirão Série A",
  stadium: "Neo Química Arena",
  round: "Rodada 22",
};

export default function MeuTimeFeed() {
  const [activeTab, setActiveTab] = useState<Tab>("Resumo");
  const [selectedTeam, setSelectedTeam] = useState(brazilianTeams[0]);
  const [searchTeam, setSearchTeam] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredTeams = brazilianTeams.filter(t =>
    t.name.toLowerCase().includes(searchTeam.toLowerCase())
  );

  return (
    <div>
      {/* Header with tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Shield className="w-6 h-6 text-x-accent" />
          <h1 className="text-xl font-extrabold">Meu Time</h1>
        </div>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] font-medium"
            >
              <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Team Selector */}
        <div className="relative mb-6">
          <label className="text-[13px] text-x-text-secondary mb-1.5 block">Selecione seu time</label>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between bg-x-search-bg border border-x-border rounded-xl px-4 py-3 text-[15px]"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedTeam.badge}</span>
              <span className="font-bold">{selectedTeam.name}</span>
            </span>
            <ChevronRight className={`w-5 h-5 text-x-text-secondary transition-transform ${showDropdown ? "rotate-90" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-x-border rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] z-30 overflow-hidden max-h-[300px] overflow-y-auto">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Buscar time..."
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="w-full bg-x-search-bg rounded-lg px-3 py-2 text-[14px] outline-none text-x-text-primary placeholder-x-text-secondary"
                />
              </div>
              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => { setSelectedTeam(team); setShowDropdown(false); setSearchTeam(""); }}
                  className={`w-full px-4 py-2.5 flex items-center gap-2 text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors ${
                    selectedTeam.id === team.id ? "bg-[rgba(26,86,219,0.1)] text-x-accent font-bold" : ""
                  }`}
                >
                  <span className="text-lg">{team.badge}</span>
                  {team.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === "Resumo" && (
          <div className="space-y-4">
            {/* Next Match Card */}
            <div className="border border-x-border rounded-2xl p-4 brand-gradient">
              <p className="text-[13px] text-white/70 font-medium mb-1">PRÓXIMO JOGO</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-white">{selectedTeam.name} vs {nextMatch.opponent}</p>
                  <p className="text-[14px] text-white/80 mt-1">{nextMatch.date} · {nextMatch.time}</p>
                  <p className="text-[13px] text-white/60 mt-0.5">{nextMatch.competition} · {nextMatch.round}</p>
                  <p className="text-[13px] text-white/60">{nextMatch.stadium}</p>
                </div>
                <Calendar className="w-10 h-10 text-white/40" />
              </div>
            </div>

            {/* Last 5 Matches */}
            <div className="border border-x-border rounded-2xl p-4">
              <h3 className="font-bold text-[15px] mb-3">Últimos 5 jogos</h3>
              <div className="flex gap-2">
                {lastMatches.map((m, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`rounded-lg py-2 px-1 text-[13px] font-bold ${
                      m.result === "W" ? "bg-green-500/20 text-green-400" :
                      m.result === "D" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {m.result === "W" ? "V" : m.result === "D" ? "E" : "D"}
                    </div>
                    <p className="text-[11px] text-x-text-secondary mt-1 truncate">{m.opponent}</p>
                    <p className="text-[12px] font-medium">{m.score}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Stats */}
            <div className="border border-x-border rounded-2xl p-4">
              <h3 className="font-bold text-[15px] mb-3">Estatísticas</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Posição", value: teamStats.position },
                  { label: "Pontos", value: teamStats.points },
                  { label: "Vitórias", value: teamStats.wins },
                  { label: "Gols", value: `${teamStats.goalsFor}/${teamStats.goalsAgainst}` },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-extrabold text-x-accent">{stat.value}</p>
                    <p className="text-[11px] text-x-text-secondary">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Elenco" && (
          <div className="border border-x-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_60px] px-4 py-2 text-[12px] text-x-text-secondary font-medium border-b border-x-border">
              <span>Jogador</span>
              <span className="text-center">Posição</span>
              <span className="text-center">Nº</span>
            </div>
            {squadPlayers.map((player) => (
              <div key={player.name} className="grid grid-cols-[1fr_80px_60px] px-4 py-3 items-center hover:bg-[rgba(231,233,234,0.03)] transition-colors border-b border-x-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-x-surface flex items-center justify-center text-[13px] font-bold text-x-text-secondary">
                    {player.name.charAt(0)}
                  </div>
                  <span className="text-[15px] font-medium">{player.name}</span>
                </div>
                <span className="text-center text-[13px] text-x-text-secondary font-medium">{player.position}</span>
                <span className="text-center text-[14px] font-bold text-x-text-secondary">{player.number}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Estatísticas" && (
          <div className="space-y-4">
            <div className="border border-x-border rounded-2xl p-4">
              <h3 className="font-bold text-[15px] mb-4">Desempenho na temporada</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Jogos", value: teamStats.matches, icon: "📊" },
                  { label: "Vitórias", value: teamStats.wins, icon: "✅" },
                  { label: "Empates", value: teamStats.draws, icon: "🟡" },
                  { label: "Derrotas", value: teamStats.losses, icon: "❌" },
                  { label: "Gols Pró", value: teamStats.goalsFor, icon: "⚽" },
                  { label: "Gols Contra", value: teamStats.goalsAgainst, icon: "🥅" },
                  { label: "Pontos", value: teamStats.points, icon: "🏆" },
                  { label: "Aproveitamento", value: `${Math.round((teamStats.points / (teamStats.matches * 3)) * 100)}%`, icon: "📈" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-x-surface rounded-xl p-3">
                    <p className="text-[12px] text-x-text-secondary">{stat.icon} {stat.label}</p>
                    <p className="text-2xl font-extrabold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Jogos" && (
          <div className="space-y-3">
            {lastMatches.map((match, i) => (
              <div key={i} className="border border-x-border rounded-2xl p-4 hover:bg-[rgba(231,233,234,0.03)] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold">{selectedTeam.name} vs {match.opponent}</p>
                    <p className="text-[13px] text-x-text-secondary mt-0.5">{match.comp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-extrabold">{match.score}</span>
                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                      match.result === "W" ? "bg-green-500/20 text-green-400" :
                      match.result === "D" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {match.result === "W" ? "V" : match.result === "D" ? "E" : "D"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
