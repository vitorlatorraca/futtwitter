export type TransferStatus = 'RUMOR' | 'NEGOCIACAO' | 'FECHADO';

export interface TransferTeam {
  id: string;
  name: string;
  slug: string;
}

export interface TransferItem {
  id: string;
  playerName: string;
  playerPhotoUrl: string | null;
  positionAbbrev: string;
  fromTeam: TransferTeam | null;
  toTeam: TransferTeam | null;
  status: TransferStatus;
  updatedAt: string;
  feeText: string | null;
  notes: string | null;
  upPercent: number;
  downPercent: number;
  voteCount: number;
  viewerVote: 'UP' | 'DOWN' | null;
}
