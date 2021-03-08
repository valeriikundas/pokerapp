import React from "react"
import { Card as CardType } from "../../models/card"
import "./card-style.css"

interface CardProps {
  card?: CardType
  disabled?: boolean
}

const Card = ({ card, disabled }: CardProps) => {
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
  )
}

export default Card
