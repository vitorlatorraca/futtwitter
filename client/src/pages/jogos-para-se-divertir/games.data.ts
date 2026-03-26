/**
 * Lista de jogos/mini-games do time.
 * Estrutura pronta para adicionar jogos reais no futuro.
 */
export interface GameItem {
  id: string;
  title: string;
  description: string;
  slug?: string;
  available: boolean;
  /** Se definido, "Abrir" navega para esta rota em vez de /jogos/adivinhe-elenco/:slug */
  selectionRoute?: string;
}

export const GAMES: GameItem[] = [
  {
    id: 'adivinhe-elenco',
    title: 'Lembra desse elenco?',
    description: 'Escolha um elenco histórico e tente acertar todos os jogadores.',
    available: true,
    selectionRoute: '/jogos/lembra-desse-elenco',
  },
  {
    id: 'quiz',
    title: 'Quiz do Time',
    description: 'Teste seus conhecimentos sobre o clube. Perguntas sobre história, jogadores e resultados.',
    slug: 'quiz',
    available: false,
  },
  {
    id: 'adivinhe',
    title: 'Adivinhe o Jogador',
    description: 'Um jogador por dia: descubra quem é pela foto borrada. A cada erro, a imagem fica mais nítida!',
    available: true,
    selectionRoute: '/jogos/adivinhe-o-jogador',
  },
  {
    id: 'escalacao',
    title: 'Escalação Perfeita',
    description: 'Monte a escalação ideal do seu time e compare com a do técnico.',
    slug: 'escalacao-perfeita',
    available: false,
  },
  {
    id: 'quem-gol',
    title: 'Quem fez o Gol?',
    description: 'Lembra quem marcou cada gol? Desafie sua memória de torcedor.',
    slug: 'quem-fez-gol',
    available: false,
  },
];
