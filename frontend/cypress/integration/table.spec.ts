import { defaultUsernameForTesting } from "src/utils/test/fixtures"
import { putMessageToLocalStorage } from "../../src/apis/mockSockets"
import { PreflopEvent, RequestActionEvent } from "../../src/models/events"
import { ActionType, EventType, Player } from "../../src/models/game"
import { TestID } from "../../src/utils/test/selectors"

describe("Table page", () => {
  it("", () => {
    cy.viewport(1400, 800)

    cy.intercept(
      "**/api/**",

      "not mocked"
    )

    const tableId = 1
    const username = defaultUsernameForTesting

    const players: Player[] = [
      { position: 1, name: "John", stack_size: 100 },
      { position: 2, name: "Tom", stack_size: 150 },
      { position: 3, name: "Kim", stack_size: 164 },
      { position: 4, name: "Kate", stack_size: 95 },
      { position: 5, name: "Alisa", stack_size: 110 },
      { position: 6, name: "Petro", stack_size: 210 },
      { position: 7, name: "Ali", stack_size: 143 },
    ]
    const potSize = 50
    const preflopEvent: PreflopEvent = {
      event: EventType.preflop,
      players: players,
      current: {
        cards: ["As", "Th"],
      },
      active_players: [1, 2, 3, 4, 5, 6],
      button_position: 3,
      pot: potSize,
      blinds: {
        small: 10,
        big: 20,
        ante: 2,
      },
    }

    cy.intercept("**/socket.io/**", preflopEvent)

    putMessageToLocalStorage(preflopEvent)

    cy.visit("/table/1")

    cy.get(`[data-cy="${TestID.TABLE_POT}"]`).should(
      "have.text",
      `pot: ${potSize}`
    )

    cy.get(`[data-cy=${TestID.TABLE_PLAYER}]`).should(
      "have.length",
      players.length
    )

    const actionSpace = [
      { type: ActionType.FOLD },
      { type: ActionType.CALL, size: 100 },
      { type: ActionType.RAISE, min: 10, max: 250 },
    ]
    const requestActionEvent: RequestActionEvent = {
      event: EventType.request_action,
      action_space: actionSpace,
    }

    putMessageToLocalStorage(requestActionEvent)

    cy.wait(100)

    cy.get(`[data-cy*=${TestID.ACTION_BUTTON}]`).should(
      "have.length",
      actionSpace.length
    )
    cy.get(`[data-cy*=${TestID.ACTION_BUTTON}]`)
      .eq(0)
      .should("have.text", "FOLD")
    cy.get(`[data-cy*=${TestID.ACTION_BUTTON}]`)
      .eq(1)
      .should("have.text", "CALL 100")
    cy.get(`[data-cy*=${TestID.ACTION_BUTTON}]`)
      .eq(2)
      .should("have.text", "RAISE 10")

    cy.wait(100)

    cy.intercept(`/act/${tableId}/${username}`).as("act")
    cy.get(`[data-cy*=${TestID.ACTION_BUTTON}]`).click()
    cy.wait("@act")
  })
})
