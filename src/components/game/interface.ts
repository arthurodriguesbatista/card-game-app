export interface Game {
  name: string;
  id: number;
  players: Player[];
  shoe: DeckCard[];
}

export interface Player {
  id: number;
  name: string;
  playerCards: PlayerCard[];
}

export interface PlayerCard {
  id: number;
  deckCard: DeckCard;
}

export interface DeckCard {
  id: number;
  card: Card;
}

interface Card {
  suit: string;
  face: string;
  value: number;
}

export interface CreateGame {
  name: string;
  playerName: string;
}
