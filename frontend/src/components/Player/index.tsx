import React from "react";
import { ICard, IPlayer, IPocketHand } from "../../types";
import Card from "../Card";
import useStyles from "./style";

interface PlayerProps {
  player: IPlayer;
  currentPlayerPosition: number;
  currentPlayerCards: IPocketHand | null;
  position: number;
  button: boolean;
  active: boolean;
}

const Player = ({
  player,
  currentPlayerPosition,
  currentPlayerCards,
  position,
  button,
  active,
}: PlayerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.player}>
      <div>
        {currentPlayerPosition === position &&
          (currentPlayerCards ? (
            currentPlayerCards.map((card: ICard, index: number) => (
              <Card key={index} card={card} />
            ))
          ) : (
            <div>
              <Card disabled />
              <Card disabled />
            </div>
          ))}
        {
          currentPlayerPosition !== position && (
            // currentPlayerCards &&
            // currentPlayerCards.map((card: ICard, index: number) => (
            <div>
              <Card disabled />
              <Card disabled />
            </div>
          )
          // ))
        }
      </div>
      <div className={classes.playerInfo}>
        <div>{player.name}</div>
        <div>{player.position || "none"}</div>
        <div>{player.stack_size}</div>
        <div>{button ? "button" : ""}</div>
        <div>{active ? "active" : ""}</div>
      </div>
    </div>
  );
};

export default Player;
