import { Card } from "src/models/card";

export type PocketHand = [Card, Card];

export enum EventType {
  preflop = "preflop",
  flop = "flop",
  turn = "turn",
  river = "river",
}

export type Player = {
  name: string;
  position: number;
  stack_size: number;
  cards?: PocketHand;
};

export type ActionType = "fold" | "check" | "call" | "raise";

export type RequestAction = {
  type: ActionType;
  size?: number;
  min?: number;
  max?: number;
};

export type Blinds = {
  small: number;
  big: number;
  ante: number;
};
