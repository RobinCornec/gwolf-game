// Score label type
export type ScoreLabel = 'Eagle' | 'Birdie' | 'Par' | 'Bogey' | 'Double' | 'Custom' | '';

// Hole score type (player name to score label)
export type HoleScore = Record<string, ScoreLabel>;

// Player score type (player name to numeric score)
export type PlayerScore = Record<string, number>;

// Player medal type (player name to medal emoji)
export type PlayerMedal = Record<string, string>;

// Hole score with player name and value
export interface PlayerHoleScore {
  name: string;
  label: ScoreLabel;
  value: number;
}

// Game data structure for storage
export interface GameData {
  date: string;
  players: string[];
  scores: HoleScore[];
  totalScores: PlayerScore;
  wolfScores: PlayerScore;
  inProgress?: boolean;
  holes?: number;
  currentHole?: number;
}

// Navigation types
export type RootStackParamList = {
  SplashScreen: undefined;
  GameSetup: undefined;
  GameScore: { 
    players: string[]; 
    holes: number;
    game?: GameData; // Optional game data for continuing a game
  };
  GameRecap: {
    players: string[];
    scores: HoleScore[];
    totalScores: PlayerScore;
    wolfScores: PlayerScore;
  };
  History: undefined;
};
