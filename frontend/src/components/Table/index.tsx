import { Button, CircularProgress, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CardComponent from "src/components/Card"
import PlayerComponent from "src/components/Player/index"
import {
  preflopEventSchema,
  requestActionEventSchema,
} from "src/schemas/events"
import { defaultUsernameForTesting } from "src/utils/test/fixtures"
import { isEventType } from "src/utils/typeGuards"
import act from "../../apis/act"
import apiClient from "../../apis/apiClient"
import { SocketMessage, useSockets } from "../../apis/useSockets"
import { Card } from "../../models/card"
import { PreflopEvent, RequestActionEvent } from "../../models/events"
import {
  ActionType,
  EventType,
  Player,
  PocketHand,
  RequestAction,
} from "../../models/game"
import { assert } from "../../utils/asserts"
import { showInfoNotification } from "../../utils/notifications"
import { TestID } from "../../utils/test/selectors"
import ActionPanel from "../ActionPanel"
import useStyles from "./style"
import { convertStringToCard } from "./utils"

const Table: React.FC = () => {
  const classes = useStyles()

  const { id } = useParams()

  const tableId: number = id

  const [
    currentPlayerPosition,
    setCurrentPlayerPosition,
  ] = React.useState<number>()

  const [
    currentPlayerCards,
    setCurrentPlayerCards,
  ] = React.useState<PocketHand>()

  const [players, setPlayers] = React.useState<Player[]>()

  const [buttonPosition, setButtonPosition] = useState(1)

  const [cardsOnTable, setCardsOnTable] = useState<Card[]>()

  const [actionPosition, setActionPosition] = React.useState<number>()

  const [username, setUsername] = React.useState<string>(
    defaultUsernameForTesting
  )

  const [actionSpace, setActionSpace] = useState<RequestAction[]>()

  const [pot, setPot] = useState<number>()

  const [isPlayer, setIsPlayer] = useState(false)

  const [socketMessage, setSocketMessage] = React.useState<SocketMessage>()

  const [blinds, setBlinds] = useState({ small: 0, big: 0, ante: 0 })

  const notifyWinner = (message: string) =>
    toast(message, {
      position: "top-center",
    })

  // const refreshPlayers = async () => {
  //   const response = await api.get("/tables/1/");
  //   setPlayers(response.data.players);
  // };

  React.useEffect(() => {
    if (!socketMessage) {
      console.debug(`socket message is empty`)
      return
    }
    const data = socketMessage

    showInfoNotification(`received ${data.event} event`)

    assert(isEventType(data.event), `unknown event type "${data.event}"`)

    const event: EventType = data.event

    switch (event) {
      case EventType.preflop: {
        preflopEventSchema.validateSync(data)
        const preflopEvent: PreflopEvent = (data as unknown) as PreflopEvent
        handlePreflop(preflopEvent)
        break
      }
      case EventType.flop_cards: {
        handleFlop(data)
        break
      }
      case EventType.turn_card: {
        handleTurn(data)
        break
      }
      case EventType.river_card: {
        // TODO:
        handleRiver(data)
        break
      }
      case EventType.winner: {
        //  TODO:
        handleWinner(data)
        break
      }
      case EventType.request_action: {
        requestActionEventSchema.validateSync(data)
        const requestActionEvent = (data as unknown) as RequestActionEvent
        handleRequestAction(requestActionEvent)
        break
      }
      default: {
        throw new Error(`unknown event type "${event}"`)
      }
    }
  }, [socketMessage])

  const handlePreflop = (data: PreflopEvent) => {
    const players = data.players.sort((a, b) => a.position - b.position)
    setPlayers(players)

    const activePlayers = data.active_players

    setButtonPosition(data.button_position)

    setBlinds(data.blinds)

    const pot: number = data.pot
    setPot(pot)

    assert(username != null, "error loading user")
    const index = players.findIndex((player) => player.name === username)
    if (index === -1) {
      throw new Error(
        `player with username "${username}" was not found in players "${players.map(
          (p) => p.name
        )}"`
      )
    }
    const position = players[index].position
    setCurrentPlayerPosition(position)

    const currentPlayerData = data.current

    const currentPlayerCards: string[] = currentPlayerData.cards
    const currentPocketHand = currentPlayerCards.map((card) =>
      convertStringToCard(card)
    ) as PocketHand

    setCurrentPlayerCards(currentPocketHand)
  }

  const handleFlop = (data: any) => {
    //  TODO:
    const receivedFlopCards: string[] = data.flop_cards
    const flopCards: Card[] = receivedFlopCards.map((card: string) =>
      convertStringToCard(card)
    )

    setCardsOnTable(flopCards)
  }

  const handleTurn = (data: any) => {
    //  TODO:
    const receivedTurnCard: string = data.turn_card
    const turnCard: Card = convertStringToCard(receivedTurnCard)
    const newCardsOnTable = [...(cardsOnTable ?? []), turnCard]
    setCardsOnTable(newCardsOnTable)
  }

  const handleRiver = (data: any) => {
    //  TODO:
    const receivedRiverCard: string = data.river_card
    const riverCard: Card = convertStringToCard(receivedRiverCard)
    const newCardsOnTable = [...(cardsOnTable ?? []), riverCard]
    setCardsOnTable(newCardsOnTable)
  }

  const handleWinner = (data: any) => {
    const winnerPosition: number = data.winner_position
    const pot: number = data.pot

    if (winnerPosition === currentPlayerPosition) {
      notifyWinner("Congrats " + winnerPosition + " You won " + pot + "chips")
    } else {
      showInfoNotification("You lost bro")
    }
  }

  const handleRequestAction = (data: RequestActionEvent) => {
    setActionSpace(data.action_space)
    setActionPosition(currentPlayerPosition)
  }

  const handleNewSocketMessage = async (x: SocketMessage): Promise<void> => {
    setSocketMessage(x)
    // FIXME: should await for message to be handled
  }

  const { sendMessage } = useSockets(handleNewSocketMessage)

  //  set main event listener
  const [restartCalled, setRestartCalled] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (restartCalled) return

    apiClient.get("/restart")
    setRestartCalled(true)
  }, [])

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // setUsername(value);
  }

  const onJoinTableClick = async () => {
    const response = await apiClient.get(`/tables/${tableId}/join/${username}/`)
    setIsPlayer(true)
    // refreshPlayers();
    // todo: subscribe #2 to socketio
  }

  const onLeaveTableClick = async () => {
    const response = await apiClient.get(
      `/tables/${tableId}/leave/${username}/`
    )
    setIsPlayer(false)
    //   refreshPlayers();
    // todo: subscribe #2 to socketio
  }

  const handleAction = (type: ActionType, size?: number) => {
    assert(tableId != null, "error loading table")
    assert(username != null, "error loading user")

    act(tableId, username, type, size)
    setActionSpace(undefined)
  }

  if (!tableId) {
    console.error(`tableId is nullish`)
    return null
  }

  return (
    <div className={classes.container}>
      <ToastContainer />
      <h3>socket message: {JSON.stringify(socketMessage)}</h3>
      <h3>tableId: {tableId}</h3>
      <h3>username: {username}</h3>
      <Button
        onClick={() => {
          apiClient.get("/restart")
        }}
      >
        Restart hand
      </Button>
      <TextField
        value={username}
        onChange={onUsernameChange}
        // disabled={isPlayer}todo:make disabled when game is going
      ></TextField>
      <Button onClick={onJoinTableClick}>Join</Button>
      <Button onClick={onLeaveTableClick}>Leave</Button>
      <div className={classes.containerTable}>
        <div className={classes.table}>
          <div
            style={{
              paddingTop: "100px",
            }}
          >
            <h1 data-cy={TestID.TABLE_POT}>pot: {pot}</h1>
            <div>
              blinds: {blinds.small} {blinds.big} {blinds.ante}
            </div>
          </div>

          <div className={classes.cardsArea}>
            {cardsOnTable?.map((card) => (
              <CardComponent key={`${card.rank}-${card.suit}`} card={card} />
            ))}
          </div>

          <div className={classes.playerArea}>
            {players ? (
              players.map((player: Player) => (
                <PlayerComponent
                  key={`${player.name}-${player.cards}`}
                  player={player}
                  isCurrentPlayer={player.position === currentPlayerPosition}
                  playerCards={currentPlayerCards}
                  isButton={player.position === buttonPosition}
                  active={player.position === actionPosition}
                />
              ))
            ) : (
              <CircularProgress color="secondary" />
            )}
          </div>
        </div>
      </div>
      <div className={classes.panel}>
        {actionSpace ? (
          <ActionPanel actions={actionSpace} onAction={handleAction} />
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  )
}

export default Table
