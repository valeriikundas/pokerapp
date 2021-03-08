import * as faker from "faker"
import { Factory } from "fishery"
import { Card, rankList, suitList } from "src/models/card"
import { Player, PocketHand } from "src/models/game"

export const defaultUsernameForTesting = "Kate"

export const cardFactory = Factory.define<Card>(() => ({
  suit: faker.random.arrayElement(suitList),
  rank: faker.random.arrayElement(rankList),
}))

export const pocketHandFactory = Factory.define<PocketHand>(() => [
  cardFactory.build(),
  cardFactory.build(),
])

export const playerFactory = Factory.define<Player>(({ sequence }) => ({
  position: sequence,
  name: faker.name.firstName(),
  stack_size: faker.random.number(200),
  cards: pocketHandFactory.build(),
}))
