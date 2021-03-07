import { Rank, rankList, Suit, suitList } from "src/models/card";

export function isRank(x: string): x is Rank {
  return typeof x === "string" && (rankList as string[]).includes(x);
}

export function isSuit(x: string): x is Suit {
  return typeof x === "string" && (suitList as string[]).includes(x);
}
