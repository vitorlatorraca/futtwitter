// Server-side teams data (without image imports).
//
// IMPORTANT:
// - Os IDs aqui devem bater com os IDs usados no client (team-data.ts),
//   pois eles são persistidos em users.teamId e news.teamId.
export const TEAMS_DATA = [
  { id: "flamengo", name: "Flamengo", shortName: "FLA", logoUrl: "https://logodetimes.com/flamengo.png", primaryColor: "#E31837", secondaryColor: "#000000" },
  { id: "palmeiras", name: "Palmeiras", shortName: "PAL", logoUrl: "https://logodetimes.com/palmeiras.png", primaryColor: "#006437", secondaryColor: "#FFFFFF" },
  { id: "corinthians", name: "Corinthians", shortName: "COR", logoUrl: "https://logodetimes.com/corinthians.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "sao-paulo", name: "São Paulo", shortName: "SAO", logoUrl: "https://logodetimes.com/saopaulo.png", primaryColor: "#EC1C24", secondaryColor: "#000000" },
  { id: "gremio", name: "Grêmio", shortName: "GRE", logoUrl: "https://logodetimes.com/gremio.png", primaryColor: "#0099CC", secondaryColor: "#000000" },
  { id: "internacional", name: "Internacional", shortName: "INT", logoUrl: "https://logodetimes.com/internacional.png", primaryColor: "#D81920", secondaryColor: "#FFFFFF" },
  { id: "atletico-mineiro", name: "Atlético Mineiro", shortName: "CAM", logoUrl: "https://logodetimes.com/atletico-mg.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "fluminense", name: "Fluminense", shortName: "FLU", logoUrl: "https://logodetimes.com/fluminense.png", primaryColor: "#7A1437", secondaryColor: "#006241" },
  { id: "botafogo", name: "Botafogo", shortName: "BOT", logoUrl: "https://logodetimes.com/botafogo.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "santos", name: "Santos", shortName: "SAN", logoUrl: "https://logodetimes.com/santos.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "vasco-da-gama", name: "Vasco da Gama", shortName: "VAS", logoUrl: "https://logodetimes.com/vasco.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "cruzeiro", name: "Cruzeiro", shortName: "CRU", logoUrl: "https://logodetimes.com/cruzeiro.png", primaryColor: "#003A70", secondaryColor: "#FFFFFF" },
  { id: "athletico-paranaense", name: "Athletico Paranaense", shortName: "CAP", logoUrl: "https://logodetimes.com/atletico-pr.png", primaryColor: "#E30613", secondaryColor: "#000000" },
  { id: "bahia", name: "Bahia", shortName: "BAH", logoUrl: "https://logodetimes.com/bahia.png", primaryColor: "#005CA9", secondaryColor: "#E30613" },
  { id: "fortaleza", name: "Fortaleza", shortName: "FOR", logoUrl: "https://logodetimes.com/fortaleza.png", primaryColor: "#E30613", secondaryColor: "#003A70" },
  { id: "bragantino", name: "Bragantino", shortName: "BRA", logoUrl: "https://logodetimes.com/bragantino.png", primaryColor: "#FFFFFF", secondaryColor: "#E30613" },
  { id: "cuiaba", name: "Cuiabá", shortName: "CUI", logoUrl: "https://logodetimes.com/cuiaba.png", primaryColor: "#FFD700", secondaryColor: "#006241" },
  { id: "goias", name: "Goiás", shortName: "GOI", logoUrl: "https://logodetimes.com/goias.png", primaryColor: "#006241", secondaryColor: "#FFFFFF" },
  { id: "coritiba", name: "Coritiba", shortName: "CFC", logoUrl: "https://logodetimes.com/coritiba.png", primaryColor: "#006241", secondaryColor: "#FFFFFF" },
  { id: "america-mineiro", name: "América Mineiro", shortName: "AME", logoUrl: "https://logodetimes.com/america-mg.png", primaryColor: "#006241", secondaryColor: "#000000" },
];
