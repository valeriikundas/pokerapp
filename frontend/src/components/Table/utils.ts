import { IRank, IPocketHand, ISuit, ICard } from "../../models/game";

export const convertStringToCard = (card: string): ICard => {
  const charToSuitMapping: { [key: string]: string } = {
    d: "diamonds",
    s: "spades",
    h: "hearts",
    c: "clubs",
  };

  const rank = card[0] as IRank;
  const suit = charToSuitMapping[card[1]] as ISuit;

  return { suit: suit, rank: rank };
};

export const convertStringsToPocketHand = (cards: string[]): IPocketHand => {
  const charToISuitMapping: { [key: string]: string } = {
    d: "diamonds",
    s: "spades",
    h: "hearts",
    c: "clubs",
  };

  const rank1 = cards[0] as IRank;
  const suit1 = charToISuitMapping[cards[1]] as ISuit;
  const rank2 = cards[2] as IRank;
  const suit2 = charToISuitMapping[cards[3]] as ISuit;

  return [
    { suit: suit1, rank: rank1 },
    { suit: suit2, rank: rank2 },
  ];
};
