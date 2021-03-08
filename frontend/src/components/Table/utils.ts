import { PocketHand } from "src/models/game"
import { Card, Rank, Suit } from "../../models/card"

export const convertStringToCard = (card: string): Card => {
  const charToSuitMapping: { [key: string]: string } = {
    d: "diamonds",
    s: "spades",
    h: "hearts",
    c: "clubs",
  }

  const rank = card[0] as Rank
  const suit = charToSuitMapping[card[1]] as Suit

  return { suit: suit, rank: rank }
}

export const convertStringsToPocketHand = (cards: string[]): PocketHand => {
  const charToISuitMapping: { [key: string]: string } = {
    d: "diamonds",
    s: "spades",
    h: "hearts",
    c: "clubs",
  }

  const rank1 = cards[0] as Rank
  const suit1 = charToISuitMapping[cards[1]] as Suit
  const rank2 = cards[2] as Rank
  const suit2 = charToISuitMapping[cards[3]] as Suit

  return [
    { suit: suit1, rank: rank1 },
    { suit: suit2, rank: rank2 },
  ]
}
