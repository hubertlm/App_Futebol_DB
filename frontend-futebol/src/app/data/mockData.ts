// Mock data for the Football Database System

export interface CompetitionStats {
  id: string;
  name: string;
  totalMatches: number;
  totalGoals: number;
  yellowCards: number;
  redCards: number;
  avgCorners: number;
}

export interface Match {
  id: string;
  date: string;
  competition: string;
  referee: string;
  corners: number;
  redCards: number;
  yellowCards: number;
  offsides: number;
}

export interface Team {
  id: string;
  name: string;
  coach: string;
  coachNationality: string;
  coachAge: number;
}

export interface Referee {
  id: string;
  name: string;
  nationality: string;
  totalCards: number;
  yellowCards: number;
  redCards: number;
}

// Competition Statistics (from SQL View: visao_estatisticas_competicao)
export const competitionStats: CompetitionStats[] = [
  {
    id: '1',
    name: 'Premier League',
    totalMatches: 380,
    totalGoals: 1024,
    yellowCards: 1456,
    redCards: 48,
    avgCorners: 10.8,
  },
  {
    id: '2',
    name: 'La Liga',
    totalMatches: 380,
    totalGoals: 978,
    yellowCards: 1689,
    redCards: 62,
    avgCorners: 9.5,
  },
  {
    id: '3',
    name: 'Serie A',
    totalMatches: 380,
    totalGoals: 892,
    yellowCards: 1834,
    redCards: 71,
    avgCorners: 9.2,
  },
  {
    id: '4',
    name: 'Bundesliga',
    totalMatches: 306,
    totalGoals: 879,
    yellowCards: 1123,
    redCards: 39,
    avgCorners: 10.1,
  },
  {
    id: '5',
    name: 'Ligue 1',
    totalMatches: 380,
    totalGoals: 856,
    yellowCards: 1567,
    redCards: 55,
    avgCorners: 9.8,
  },
  {
    id: '6',
    name: 'Liga dos Campeões',
    totalMatches: 125,
    totalGoals: 342,
    yellowCards: 478,
    redCards: 18,
    avgCorners: 11.2,
  },
];

// Teams
export const teams: Team[] = [
  {
    id: '1',
    name: 'Manchester United',
    coach: 'Erik ten Hag',
    coachNationality: 'Netherlands',
    coachAge: 54,
  },
  {
    id: '2',
    name: 'Real Madrid',
    coach: 'Carlo Ancelotti',
    coachNationality: 'Italy',
    coachAge: 65,
  },
  {
    id: '3',
    name: 'Bayern Munich',
    coach: 'Thomas Tuchel',
    coachNationality: 'Germany',
    coachAge: 51,
  },
  {
    id: '4',
    name: 'Barcelona',
    coach: 'Xavi Hernández',
    coachNationality: 'Spain',
    coachAge: 44,
  },
  {
    id: '5',
    name: 'Paris Saint-Germain',
    coach: 'Luis Enrique',
    coachNationality: 'Spain',
    coachAge: 54,
  },
  {
    id: '6',
    name: 'Liverpool',
    coach: 'Jürgen Klopp',
    coachNationality: 'Germany',
    coachAge: 57,
  },
  {
    id: '7',
    name: 'Inter Milan',
    coach: 'Simone Inzaghi',
    coachNationality: 'Italy',
    coachAge: 48,
  },
  {
    id: '8',
    name: 'Juventus',
    coach: 'Massimiliano Allegri',
    coachNationality: 'Italy',
    coachAge: 57,
  },
];

// Referees with their statistics
export const referees: Referee[] = [
  {
    id: '1',
    name: 'Michael Oliver',
    nationality: 'England',
    totalCards: 142,
    yellowCards: 128,
    redCards: 14,
  },
  {
    id: '2',
    name: 'Daniele Orsato',
    nationality: 'Italy',
    totalCards: 189,
    yellowCards: 167,
    redCards: 22,
  },
  {
    id: '3',
    name: 'Clément Turpin',
    nationality: 'France',
    totalCards: 156,
    yellowCards: 142,
    redCards: 14,
  },
  {
    id: '4',
    name: 'Felix Brych',
    nationality: 'Germany',
    totalCards: 134,
    yellowCards: 121,
    redCards: 13,
  },
  {
    id: '5',
    name: 'Antonio Mateu Lahoz',
    nationality: 'Spain',
    totalCards: 234,
    yellowCards: 206,
    redCards: 28,
  },
  {
    id: '6',
    name: 'Björn Kuipers',
    nationality: 'Netherlands',
    totalCards: 98,
    yellowCards: 89,
    redCards: 9,
  },
  {
    id: '7',
    name: 'Slavko Vinčić',
    nationality: 'Slovenia',
    totalCards: 112,
    yellowCards: 101,
    redCards: 11,
  },
  {
    id: '8',
    name: 'Szymon Marciniak',
    nationality: 'Poland',
    totalCards: 145,
    yellowCards: 132,
    redCards: 13,
  },
];

// Matches
export const matches: Match[] = [
  {
    id: '1',
    date: '2025-01-12',
    competition: 'Premier League',
    referee: 'Michael Oliver',
    corners: 12,
    redCards: 1,
    yellowCards: 4,
    offsides: 5,
  },
  {
    id: '2',
    date: '2025-01-11',
    competition: 'La Liga',
    referee: 'Antonio Mateu Lahoz',
    corners: 9,
    redCards: 0,
    yellowCards: 6,
    offsides: 7,
  },
  {
    id: '3',
    date: '2025-01-10',
    competition: 'Serie A',
    referee: 'Daniele Orsato',
    corners: 8,
    redCards: 2,
    yellowCards: 8,
    offsides: 4,
  },
];

// KPI Summary Data
export const kpiData = {
  totalMatches: competitionStats.reduce((sum, comp) => sum + comp.totalMatches, 0),
  totalGoals: competitionStats.reduce((sum, comp) => sum + comp.totalGoals, 0),
  avgCorners: (
    competitionStats.reduce((sum, comp) => sum + comp.avgCorners, 0) / competitionStats.length
  ).toFixed(1),
  totalYellowCards: competitionStats.reduce((sum, comp) => sum + comp.yellowCards, 0),
  totalRedCards: competitionStats.reduce((sum, comp) => sum + comp.redCards, 0),
};