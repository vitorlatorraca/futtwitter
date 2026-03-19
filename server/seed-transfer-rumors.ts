/**
 * Seed: popula transfer_rumors com negociações realistas do futebol brasileiro.
 * Execute: NODE_ENV=development npx tsx server/seed-transfer-rumors.ts
 */
import { db } from "./db";
import { transferRumors } from "../shared/schema";
import { sql } from "drizzle-orm";

// IDs reais do banco
const CHICO_ID = "149a2639-dcf2-4b73-9f65-73e66d44fdb5"; // Chico Moedas (jornalista)
const VITOR_ID = "f776ac8c-ed71-41a6-973e-b177903878cf"; // Vitor Latorraca (jornalista)

// Times
const T = {
  flamengo:            "flamengo",
  palmeiras:           "palmeiras",
  corinthians:         "corinthians",
  atletico:            "atletico-mineiro",
  fluminense:          "fluminense",
  botafogo:            "botafogo",
  santos:              "santos",
  saoPaulo:            "sao-paulo",
  gremio:              "gremio",
  internacional:       "internacional",
  cruzeiro:            "cruzeiro",
  fortaleza:           "fortaleza",
  athletico:           "athletico-paranaense",
  vasco:               "vasco-da-gama",
  bragantino:          "rb-bragantino",
  bahia:               "bahia",
  americaMineiro:      "america-mineiro",
};

// Jogadores (IDs reais da tabela players)
const P = {
  andreasPereira:   "bac92323-a8d1-47c5-b5cb-7ee080b743fe", // Flamengo - Attacking Mid
  felipeAnderson:   "87005d80-6a3a-4744-9152-fb96fb0ddb65", // Right Winger
  facundoTorres:    "72a0280c-b772-4d85-8ac0-53f5bab68304", // Right Winger
  gabrielPaulista:  "c67408bc-e4e9-43c5-9825-b053fa31680a", // Centre-Back
  brunoFuchs:       "ae6064fa-d726-42ec-86e7-013112f407e5", // Centre-Back
  brenoBidon:       "530b98ca-20c7-4fc0-8e51-336ad640bdfe", // Defensive Mid
  anibalMoreno:     "484abd9f-438e-406e-904e-32306e4dc9ee", // Defensive Mid
  gustavoGomez:     "8c20a485-c0ec-4af7-9f73-ed8614e8892b", // Centre-Back
  andreRamalho:     "44fc2572-10cf-4ad1-89d8-4f14d121a1ff", // Centre-Back
  carlosMiguel:     "0d2dfefb-4810-4eb1-b997-71e451f88ab2", // Goalkeeper
  andreCarrillo:    "d6092412-2483-4a6f-af5e-4ba359c7c984", // Central Mid
  felipeLongo:      "bb9735fd-46c6-4fbe-97b3-d1ebbbd109bc", // Goalkeeper
  guilhermeArana:   "0c7dc35c-2ecf-454b-92b0-1041fc3bc520", // Left-Back
  cacaZB:           "792c5238-c3b9-4821-bb30-115f601b2a46", // Centre-Back
  gustavoHenrique:  "ae9606de-2556-4159-b2bf-bb3195923d6b", // Centre-Back
};

const seeds = [
  // ── RUMORES ──────────────────────────────────────────────────
  {
    playerId:       P.andreasPereira,
    fromTeamId:     T.flamengo,
    toTeamId:       T.internacional,
    status:         "RUMOR",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "GE",
    sourceUrl:      null,
    note:           "Flamengo avalia proposta do Colorado pelo meia. Contrato atual termina em dezembro.",
    createdByUserId: CHICO_ID,
  },
  {
    playerId:       P.facundoTorres,
    fromTeamId:     T.fluminense,
    toTeamId:       T.corinthians,
    status:         "RUMOR",
    feeAmount:      "8",
    feeCurrency:    "USD",
    sourceName:     "ESPN Brasil",
    sourceUrl:      null,
    note:           "Corinthians sondou o atacante uruguaio do Flu. Diretoria ainda não apresentou proposta formal.",
    createdByUserId: CHICO_ID,
  },
  {
    playerId:       P.anibalMoreno,
    fromTeamId:     T.athletico,
    toTeamId:       T.gremio,
    status:         "RUMOR",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "Uol Esporte",
    sourceUrl:      null,
    note:           "Grêmio tenta repatriar o volante argentino. Athletico pede 12M para liberar.",
    createdByUserId: VITOR_ID,
  },
  {
    playerId:       P.gustavoHenrique,
    fromTeamId:     T.flamengo,
    toTeamId:       T.americaMineiro,
    status:         "RUMOR",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "Fabrizio Romano",
    sourceUrl:      null,
    note:           "América-MG monitora o zagueiro rubro-negro que perdeu espaço com Tite.",
    createdByUserId: CHICO_ID,
  },

  // ── NEGOCIANDO ───────────────────────────────────────────────
  {
    playerId:       P.brenoBidon,
    fromTeamId:     T.corinthians,
    toTeamId:       T.fluminense,
    status:         "NEGOTIATING",
    feeAmount:      "5",
    feeCurrency:    "EUR",
    sourceName:     "Globo Esporte",
    sourceUrl:      null,
    note:           "Fluminense avançou na negociação. Corinthians pede 5M de euros e percentual de revenda. Bidon já teria acertado valores pessoais.",
    createdByUserId: CHICO_ID,
  },
  {
    playerId:       P.andreRamalho,
    fromTeamId:     T.bragantino,
    toTeamId:       T.vasco,
    status:         "NEGOTIATING",
    feeAmount:      "3",
    feeCurrency:    "BRL",
    sourceName:     "Lance!",
    sourceUrl:      null,
    note:           "Vasco e RB Bragantino próximos de acordo pelo zagueiro. Cláusula de multa facilitou a negociação.",
    createdByUserId: VITOR_ID,
  },
  {
    playerId:       P.guilhermeArana,
    fromTeamId:     T.atletico,
    toTeamId:       T.saoPaulo,
    status:         "NEGOTIATING",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "TNT Sports",
    sourceUrl:      null,
    note:           "São Paulo negocia o lateral-esquerdo da Raposa. Arana teria pedido para sair após desentendimento com a comissão técnica.",
    createdByUserId: CHICO_ID,
  },
  {
    playerId:       P.carlosMiguel,
    fromTeamId:     T.corinthians,
    toTeamId:       T.botafogo,
    status:         "NEGOTIATING",
    feeAmount:      "2",
    feeCurrency:    "EUR",
    sourceName:     "GE",
    sourceUrl:      null,
    note:           "Botafogo apresentou proposta de 2M de euros pelo goleiro corintiano. Negociação avançada mas ainda não fechada.",
    createdByUserId: VITOR_ID,
  },

  // ── FECHADOS ─────────────────────────────────────────────────
  {
    playerId:       P.gabrielPaulista,
    fromTeamId:     T.atletico,
    toTeamId:       T.cruzeiro,
    status:         "DONE",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "Rádio Itatiaia",
    sourceUrl:      null,
    note:           "Zagueiro veterano assinou contrato de 2 anos com a Raposa. Reforça a defesa para o Brasileirão.",
    createdByUserId: CHICO_ID,
  },
  {
    playerId:       P.cacaZB,
    fromTeamId:     T.corinthians,
    toTeamId:       T.bahia,
    status:         "DONE",
    feeAmount:      "4",
    feeCurrency:    "BRL",
    sourceName:     "ESPN Brasil",
    sourceUrl:      null,
    note:           "Cacá foi vendido ao Bahia por 4M de reais. Jogador já realizou exames médicos e assinou por 18 meses.",
    createdByUserId: VITOR_ID,
  },

  // ── CANCELADO ────────────────────────────────────────────────
  {
    playerId:       P.gustavoGomez,
    fromTeamId:     T.palmeiras,
    toTeamId:       T.saoPaulo,
    status:         "CANCELLED",
    feeAmount:      null,
    feeCurrency:    "BRL",
    sourceName:     "UOL",
    sourceUrl:      null,
    note:           "Negociação polêmica entre rivais foi encerrada. Palmeiras recusou oferta e renovará com o capitão paraguaio.",
    createdByUserId: CHICO_ID,
  },
];

async function main() {
  // Checar se já existe seed (evitar duplicata)
  const existing = await db.execute(
    sql`SELECT COUNT(*) as total FROM transfer_rumors WHERE created_by_user_id IN (${CHICO_ID}, ${VITOR_ID})`
  );
  const total = Number((existing as any).rows[0]?.total ?? 0);
  if (total > 2) {
    console.log(`ℹ️ Já existem ${total} rumores de jornalistas. Pulando seed.`);
    process.exit(0);
  }

  console.log("🌱 Inserindo transferências realistas...\n");
  let inserted = 0;

  for (const seed of seeds) {
    try {
      await db.insert(transferRumors).values({
        playerId:        seed.playerId,
        fromTeamId:      seed.fromTeamId,
        toTeamId:        seed.toTeamId,
        status:          seed.status as any,
        feeAmount:       seed.feeAmount,
        feeCurrency:     seed.feeCurrency,
        sourceName:      seed.sourceName,
        sourceUrl:       seed.sourceUrl,
        note:            seed.note,
        createdByUserId: seed.createdByUserId,
      });
      console.log(`  ✅ [${seed.status.padEnd(11)}] player:${seed.playerId.slice(0, 8)}... → ${seed.toTeamId}`);
      inserted++;
    } catch (e: any) {
      console.error(`  ❌ Erro: ${e.message}`);
    }
  }

  console.log(`\n🎉 Seed concluído! ${inserted}/${seeds.length} rumores inseridos.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Falha no seed:", e.message);
  process.exit(1);
});
