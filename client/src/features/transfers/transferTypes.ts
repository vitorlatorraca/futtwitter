/** Display status (legacy labels). API uses RUMOR | NEGOTIATING | DONE | CANCELLED */
export type TransferStatus = 'RUMOR' | 'NEGOCIACAO' | 'FECHADO';

/** API status enum (transfer_rumors table) */
export type TransferRumorStatus = 'RUMOR' | 'NEGOTIATING' | 'DONE' | 'CANCELLED';

/** 'all' = full market, 'team' = filtered by user's team */
export type TransfersScope = 'all' | 'team';

export interface TransferTeam {
  id: string;
  name: string;
  shortName?: string;
  slug?: string;
}

export interface TransferAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  badge: string;
}

export interface TransferVoteBlock {
  likes: number;
  dislikes: number;
  userVote: 'LIKE' | 'DISLIKE' | null;
}

export interface TransferItem {
  id: string;
  playerName: string;
  playerPhotoUrl: string | null;
  positionAbbrev: string;
  fromTeam: TransferTeam | null;
  toTeam: TransferTeam | null;
  fromTeamId?: string;
  toTeamId?: string;
  status: TransferStatus;
  updatedAt: string;
  feeText: string | null;
  notes: string | null;
  author: TransferAuthor | null;
  selling: TransferVoteBlock;
  buying: TransferVoteBlock;
}
