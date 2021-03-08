import { Card } from "src/models/card"

export type PocketHand = [Card, Card]

export enum EventType {
  preflop = "preflop",
  flop_cards = "flop_cards",
  turn_card = "turn_card",
  river_card = "river_card",
  winner = "winner",
  request_action = "request_action",
  // TODO: add event for notifying player about actions of other players
}

export const eventTypeList: EventType[] = [
  EventType.preflop,
  EventType.flop_cards,
  EventType.turn_card,
  EventType.river_card,
  EventType.winner,
  EventType.request_action,
]

export type Player = {
  name: string
  position: number
  stack_size: number
  cards?: PocketHand
}

export enum ActionType {
  FOLD = "FOLD",
  CHECK = "CHECK",
  CALL = "CALL",
  RAISE = "RAISE",
}

export const actionTypeList = ["FOLD", "CHECK", "CALL", "RAISE"]

export type RequestAction = {
  type: ActionType
  size?: number
  min?: number
  max?: number
}

export type Blinds = {
  small: number
  big: number
  ante: number
}
