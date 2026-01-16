export interface Card {
  id: string;
  name: string;
  value: number;
  suit: string;
}

export interface Player {
  email: string;
  points: number;
  cardsHistory: Card[];
  aceValues: Record<string, boolean>;
  busted: boolean;
}

export interface GameResult {
  winner?: string;
  tiedPlayers: string[];
  highestScore: number;
  allPlayers: Record<string, {
    points: number;
    cardsCount: number;
    busted: boolean;
  }>;
}

export interface Game {
  id: string;
  players: Record<string, Player>;
  availableCards: Card[];
  finished: boolean;
  turnOrder: string[];
}