import { EventType, Blinds, Player } from "./game";

export type PreflopEvent = {
  event: EventType;
  players: Player[];
  active_players: number[];
  button_position: number;
  blinds: Blinds;
  pot: number;
  current: {
    cards: string[];
  };
};
