import { Blinds, EventType, Player, RequestAction } from "./game"

interface BaseEvent {
  event: EventType
}

export interface PreflopEvent extends BaseEvent {
  event: EventType.preflop
  players: Player[]
  active_players: number[]
  button_position: number
  blinds: Blinds
  pot: number
  current: {
    cards: string[]
  }
}

export interface RequestActionEvent extends BaseEvent {
  event: EventType.request_action
  action_space: RequestAction[]
}
