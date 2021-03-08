import React from "react"
import CardComponent from "src/components/Card"
import { TestID } from "src/utils/test/selectors"
import { Player as PlayerType, PocketHand } from "../../models/game"
import useStyles from "./style"

interface PlayerProps {
  player: PlayerType
  isCurrentPlayer: boolean
  playerCards?: PocketHand
  isButton: boolean
  active: boolean
}

const Player = ({
  player,
  isCurrentPlayer,
  playerCards,
  isButton,
  active,
}: PlayerProps) => {
  const classes = useStyles()

  return (
    <div className={classes.player} data-cy={TestID.TABLE_PLAYER}>
      <div>
        {isCurrentPlayer ? (
          playerCards && (
            <>
              <CardComponent card={playerCards[0]} />
              <CardComponent card={playerCards[1]} />
            </>
          )
        ) : (
          <>
            <CardComponent disabled />
            <CardComponent disabled />
          </>
        )}
      </div>
      <div className={classes.playerInfo}>
        <div>{player.name}</div>
        <div>{player.position}</div>
        <div>{player.stack_size}</div>
        <div>{isButton ? "button" : ""}</div>
        <div>{active ? "active" : ""}</div>
      </div>
    </div>
  )
}

export default Player
