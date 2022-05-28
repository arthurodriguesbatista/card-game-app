export interface Game {
  name: string;
  id: number;
  players: Player[];
  shoe: DeckCard[];
}

export interface Player {
  id: number;
  name: string;
  deckCards: DeckCard[];
}

export interface DeckCard {
  id: number;
  card: Card;
}

interface Card {
  suit: string;
  face: string;
  value: number;
  imageUrl: string;
}

export interface CreateGame {
  name: string;
  playerName: string;
}
