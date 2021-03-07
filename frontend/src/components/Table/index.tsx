import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardComponent from "src/components/Card";
import PlayerComponent from "src/components/Player/index";
import act from "../../apis/act";
import apiClient from "../../apis/apiClient";
import { SocketMessage, useSockets } from "../../apis/useSockets";
import { Card } from "../../models/card";
import { PreflopEvent } from "../../models/events";
import {
  ActionType,
  Player,
  PocketHand,
  RequestAction,
} from "../../models/game";
import { preflopSchema } from "../../schemas";
import { assert } from "../../utils/asserts";
import { TestID } from "../../utils/test/selectors";
import ActionPanel from "../ActionPanel";
import { showInfoNotification } from "../Common/notifications";
import useStyles from "./style";
import { convertStringToCard } from "./utils";

const Table: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams();

  const tableId: number = id;

  const [
    currentPlayerPosition,
    setCurrentPlayerPosition,
  ] = React.useState<number>();
  const [
    currentPlayerCards,
    setCurrentPlayerCards,
  ] = React.useState<PocketHand | null>(null);

  const [players, setPlayers] = React.useState<Player[]>([]);

  const [buttonPosition, setButtonPosition] = useState(1);

  const [cardsOnTable, setCardsOnTable] = useState<Card[]>();

  const [actionPosition, setActionPosition] = React.useState<number>();

  const [username, setUsername] = useState<string>();

  const [actions, setActions] = useState<RequestAction[]>([]);

  const [pot, setPot] = useState<number>();

  const [isPlayer, setIsPlayer] = useState(false);

  const [socketMessage, setSocketMessage] = React.useState<SocketMessage>();

  const [blinds, setBlinds] = useState({ small: 0, big: 0, ante: 0 });

  const notifyWinner = (message: string) =>
    toast(message, {
      position: "top-center",
    });

  // const refreshPlayers = async () => {
  //   const response = await api.get("/tables/1/");
  //   setPlayers(response.data.players);
  // };

  useEffect(() => {
    const data = socketEventData;

    setSocketResponse(`${data}`);
    notify(`received ${data["event"]} event`);

    const event = data["event"];

    switch (event) {
      case "preflop": {
        handlePreflop(data);
        break;
      }
      case "flop_cards": {
        handleFlop(data);
        break;
      }
      case "turn_card": {
        handleTurn(data);
        break;
      }
      case "river_card": {
        // TODO:
        handleRiver(data);
        break;
      }
      case "winner": {
        //  TODO:
        handleWinner(data);
        break;
      }
      case "request_action": {
        //  TODO:
        handleRequestAction(data);
        break;
      }
      case undefined: {
        break;
      }
      default: {
        alert("wrong event type came from backend => " + event);
      }
      //  TODO: other events
    }
  }, [socketMessage]);

  const handlePreflop = (data: PreflopEvent) => {
    setPlayers(daya.players);

    const activePlayers = data.active_players;

    const buttonPosition: number = data.button_position;

    const blinds = data.blinds;
    setBlinds({
      small: blinds.small,
      big: blinds.big,
      ante: blinds.ante,
    });

    const pot: number = data.pot;
    setPot(pot);

    const currentPlayerData = data.current;

    const currentPlayerCards: string[] = currentPlayerData.cards;
    const currentPocketHand = currentPlayerCards.map((card) =>
      convertStringToCard(card)
    ) as PocketHand;

    setCurrentPlayerCards(currentPocketHand);

    const index = players.findIndex((player) => player.name === username);
    if (index === -1) {
      console.error(
        `player with username ${username} was not found in players`
      );
      console.error(players);
      return;
    }
    const position = players[index].position;
    setCurrentPlayerPosition(position);
  };

  const handleFlop = (data: any) => {
    //  TODO:
    const receivedFlopCards: string[] = data.flop_cards;
    const flopCards: Card[] = receivedFlopCards.map((card: string) =>
      convertStringToCard(card)
    );

    setCardsOnTable(flopCards);
  };

  const handleTurn = (data: any) => {
    //  TODO:
    const receivedTurnCard: string = data.turn_card;
    const turnCard: Card = convertStringToCard(receivedTurnCard);
    const newCardsOnTable = [...cardsOnTable, turnCard];
    setCardsOnTable(newCardsOnTable);
  };

  const handleRiver = (data: any) => {
    //  TODO:
    const receivedRiverCard: string = data.river_card;
    const riverCard: Card = convertStringToCard(receivedRiverCard);
    const newCardsOnTable = [...cardsOnTable, riverCard];
    setCardsOnTable(newCardsOnTable);
  };

  const handleWinner = (data: any) => {
    const winnerPosition: number = data.winner_position;
    const pot: number = data.pot;

    if (winnerPosition === currentPlayerPosition) {
      notifyWinner("Congrats " + winnerPosition + " You won " + pot + "chips");
    } else {
      showInfoNotification("You lost bro");
    }
  };

  const handleRequestAction = (data: any) => {
    const readActionSpace: { [key: string]: any }[] = data.action_space;

    const actionSpace: RequestAction[] = readActionSpace.map((action) => {
      const { type, size, min, max } = action;
      const a: RequestAction = { type, size, min, max };
      return a;
    });
    setActions(actionSpace);
  };

  const handleNewSocketMessage = async (x: SocketMessage): Promise<void> => {
    setSocketMessage(x);
    // FIXME: should await for message to be handled
  };

  const { sendMessage } = useSockets(handleNewSocketMessage);

  //  set main event listener
  const [restartCalled, setRestartCalled] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (restartCalled) return;

    apiClient.get("/restart");
    setRestartCalled(true);
  }, []);

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // setUsername(value);
  };

  const onJoinTableClick = async () => {
    const response = await apiClient.get(
      `/tables/${tableId}/join/${username}/`
    );
    console.log("response", response);
    setIsPlayer(true);
    // refreshPlayers();
    // todo: subscribe #2 to socketio
  };

  const onLeaveTableClick = async () => {
    const response = await apiClient.get(
      `/tables/${tableId}/leave/${username}/`
    );
    setIsPlayer(false);
    //   refreshPlayers();
    // todo: subscribe #2 to socketio
  };

  const handleAction = (type: ActionType, size?: number) => {
    assert(tableId != null, "error loading table");
    assert(username != null, "error loading user");

    act(tableId, username, type, size);
    setActions([]);
  };

  if (!tableId) {
    console.error(`tableId is nullish`);
    return null;
  }

  return (
    <div className={classes.container}>
      <ToastContainer />
      <h3>socket message: {JSON.stringify(socketMessage)}</h3>
      <h3>tableId: {tableId}</h3>
      <h3>username: {username}</h3>
      <Button
        onClick={() => {
          apiClient.get("/restart");
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
            <div>pot: {pot}</div>
            <div>
              blinds: {blinds.small} {blinds.big} {blinds.ante}
            </div>
          </div>

          {/* {event !== "preflop" && event !== "" && ( */}
          <div className={classes.cardsArea}>
            {cardsOnTable.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
          {/* )} */}

          <div className={classes.playerArea}>
            {players
              .sort((a, b) => {
                return a.position - b.position;
              })
              .map((player: IPlayer) => (
                <Player
                  player={player}
                  currentPlayerPosition={currentPlayerPosition}
                  currentPlayerCards={currentPlayerCards}
                  position={player.position}
                  key={player.position}
                  button={player.position === buttonPosition}
                  active={player.position === actionPosition}
                />
              ))}
          </div>
        </div>
      </div>
      <div className={classes.panel}>
        {
          // event === "request_action" &&
          // currentPlayerPosition === actionPosition &&
          <ActionPanel actions={actions} handleAction={handleAction} />
        }
      </div>
    </div>
  );
};

export default Table;
