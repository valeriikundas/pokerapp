import * as yup from "yup";
import { rankList, suitList } from "../models/card";

export const cardSchema = yup.object().shape({
  suit: yup.string().oneOf(suitList).required(),
  rank: yup.string().oneOf(rankList).required(),
});

export const playerSchema = yup.object().shape({
  name: yup.string().required(),
  position: yup.number().required(),
  stack_size: yup.number().required(),
  cards: yup.array().length(2).of(yup.array(cardSchema)).optional(),
});

export const currentPlayerSchema = yup.object().shape({
  cards: yup.array().length(2).of(yup.string()).required(),
});

export const blindSchema = yup.object().shape({
  small: yup.number().required(),
  big: yup.number().required(),
  ante: yup.number().required(),
});

export const preflopSchema = yup.object().shape({
  players: yup.array(playerSchema).required(),
  button_position: yup.number().required(),
  blinds: blindSchema.required(),
  pot: yup.number().required(),
  current: currentPlayerSchema.required(),
});
