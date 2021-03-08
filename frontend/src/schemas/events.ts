import * as yup from "yup";
import {
  blindSchema,
  currentPlayerSchema,
  playerSchema,
  requestActionSchema,
} from "./index";

export const preflopEventSchema = yup
  .object()
  .shape({
    event: yup.string().oneOf(["preflop"]),
    players: yup.array(playerSchema).required(),
    active_players: yup.array().of(yup.number().min(0).max(9)),
    button_position: yup.number().required(),
    blinds: blindSchema.required(),
    pot: yup.number().required(),
    current: currentPlayerSchema.required(),
  })
  .noUnknown(true)
  .strict();

export const requestActionEventSchema = yup
  .object()
  .shape({
    event: yup.string().oneOf(["request_action"]),
    action_space: yup.array().of(requestActionSchema),
  })
  .noUnknown(true)
  .strict();
