export type IPlayer = {
  name: string;
  position: number;
  stack_size: number;
  cards?: IPocketHand;
};

export type ISuit = "diamonds" | "hearts" | "clubs" | "spades";

export type IRank =
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

export type ICard = {
  suit: ISuit;
  rank: IRank;
};

export type IPocketHand = [ICard, ICard];

export type ActionType = "fold" | "check" | "call" | "raise";

export type IRequestAction = {
  type: ActionType;
  size?: number;
  min?: number;
  max?: number;
};
