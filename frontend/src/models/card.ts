export type Suit = "diamonds" | "hearts" | "clubs" | "spades";

export const suitList: Suit[] = ["diamonds", "hearts", "clubs", "spades"];

export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";

export const rankList: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

export type Card = {
  suit: Suit;
  rank: Rank;
};
