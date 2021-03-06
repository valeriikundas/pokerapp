import React from "react";
import { ICard } from "../../models/game";
import "./card-style.css";

interface ICardProps {
  card?: ICard;
  disabled?: boolean;
}

const Card = ({ card, disabled }: ICardProps) => {
  return (
    <>
      {disabled ? (
        <div className="cardDisabled"></div>
      ) : (
        card && (
          <div className="card">
            <h2 className={`${card.suit}-value`}>{card.rank}</h2>
            <div className={card.suit}></div>
            <h2 className={`${card.suit}-value`}>{card.rank}</h2>
          </div>
        )
      )}
    </>
  );
};

export default Card;
