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
}

export const GAMES: GameItem[] = [
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
    description: 'Descubra quem é o jogador pela silhueta, estatísticas ou dicas.',
    slug: 'adivinhe-jogador',
    available: false,
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
