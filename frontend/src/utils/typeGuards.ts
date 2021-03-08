import { Rank, rankList, Suit, suitList } from "src/models/card"
import { EventType, eventTypeList } from "src/models/game"

export function isRank(x: unknown): x is Rank {
  return typeof x === "string" && (rankList as string[]).includes(x)
}

export function isSuit(x: unknown): x is Suit {
  return typeof x === "string" && (suitList as string[]).includes(x)
}

export function isEventType(x: unknown): x is EventType {
  return typeof x === "string" && (eventTypeList as string[]).includes(x)
}
