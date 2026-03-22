export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

// CDN URLs from API-Football (media.api-sports.io) — same source as Neon DB
export const TEAMS_DATA: TeamData[] = [
  { id: 'flamengo',               name: 'Flamengo',               shortName: 'FLA', logoUrl: 'https://media.api-sports.io/football/teams/127.png',  primaryColor: '#E31837', secondaryColor: '#000000' },
  { id: 'palmeiras',              name: 'Palmeiras',              shortName: 'PAL', logoUrl: 'https://media.api-sports.io/football/teams/121.png',  primaryColor: '#006437', secondaryColor: '#FFFFFF' },
  { id: 'corinthians',            name: 'Corinthians',            shortName: 'COR', logoUrl: 'https://media.api-sports.io/football/teams/131.png',  primaryColor: '#000000', secondaryColor: '#FFFFFF' },
  { id: 'sao-paulo',              name: 'São Paulo',              shortName: 'SAO', logoUrl: 'https://media.api-sports.io/football/teams/126.png',  primaryColor: '#EC1C24', secondaryColor: '#000000' },
  { id: 'gremio',                 name: 'Grêmio',                 shortName: 'GRE', logoUrl: 'https://media.api-sports.io/football/teams/130.png',  primaryColor: '#0099CC', secondaryColor: '#000000' },
  { id: 'internacional',          name: 'Internacional',          shortName: 'INT', logoUrl: 'https://media.api-sports.io/football/teams/119.png',  primaryColor: '#D81920', secondaryColor: '#FFFFFF' },
  { id: 'atletico-mineiro',       name: 'Atlético Mineiro',       shortName: 'CAM', logoUrl: 'https://media.api-sports.io/football/teams/1062.png', primaryColor: '#000000', secondaryColor: '#FFFFFF' },
  { id: 'fluminense',             name: 'Fluminense',             shortName: 'FLU', logoUrl: 'https://media.api-sports.io/football/teams/124.png',  primaryColor: '#7A1437', secondaryColor: '#006241' },
  { id: 'botafogo',               name: 'Botafogo',               shortName: 'BOT', logoUrl: 'https://media.api-sports.io/football/teams/120.png',  primaryColor: '#000000', secondaryColor: '#FFFFFF' },
  { id: 'santos',                 name: 'Santos',                 shortName: 'SAN', logoUrl: 'https://media.api-sports.io/football/teams/152.png',  primaryColor: '#000000', secondaryColor: '#FFFFFF' },
  { id: 'vasco-da-gama',          name: 'Vasco da Gama',          shortName: 'VAS', logoUrl: 'https://media.api-sports.io/football/teams/133.png',  primaryColor: '#000000', secondaryColor: '#FFFFFF' },
  { id: 'cruzeiro',               name: 'Cruzeiro',               shortName: 'CRU', logoUrl: 'https://media.api-sports.io/football/teams/135.png',  primaryColor: '#003A70', secondaryColor: '#FFFFFF' },
  { id: 'athletico-paranaense',   name: 'Athletico Paranaense',   shortName: 'CAP', logoUrl: 'https://media.api-sports.io/football/teams/134.png',  primaryColor: '#E30613', secondaryColor: '#000000' },
  { id: 'bahia',                  name: 'Bahia',                  shortName: 'BAH', logoUrl: 'https://media.api-sports.io/football/teams/118.png',  primaryColor: '#005CA9', secondaryColor: '#E30613' },
  { id: 'fortaleza',              name: 'Fortaleza',              shortName: 'FOR', logoUrl: 'https://media.api-sports.io/football/teams/154.png',  primaryColor: '#E30613', secondaryColor: '#003A70' },
  { id: 'bragantino',             name: 'RB Bragantino',          shortName: 'BRA', logoUrl: 'https://media.api-sports.io/football/teams/794.png',  primaryColor: '#FFFFFF', secondaryColor: '#E30613' },
  { id: 'cuiaba',                 name: 'Cuiabá',                 shortName: 'CUI', logoUrl: 'https://media.api-sports.io/football/teams/1193.png', primaryColor: '#FFD700', secondaryColor: '#006241' },
  { id: 'goias',                  name: 'Goiás',                  shortName: 'GOI', logoUrl: 'https://media.api-sports.io/football/teams/142.png',  primaryColor: '#006241', secondaryColor: '#FFFFFF' },
  { id: 'coritiba',               name: 'Coritiba',               shortName: 'CFC', logoUrl: 'https://media.api-sports.io/football/teams/148.png',  primaryColor: '#006241', secondaryColor: '#FFFFFF' },
  { id: 'america-mineiro',        name: 'América Mineiro',        shortName: 'AME', logoUrl: 'https://media.api-sports.io/football/teams/143.png',  primaryColor: '#006241', secondaryColor: '#000000' },
];
