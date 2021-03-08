import { Button, makeStyles } from "@material-ui/core"
import React from "react"
import { TestID } from "src/utils/test/selectors"

const useStyles = makeStyles({
  actionButton: {
    border: "1px solid #40ffe5",
    borderRadius: "2px",
    background: "#2d7576",
    margin: "5px 15px",
    textTransform: "uppercase",
    padding: "20px 30px",
  },
})

export const ActionButton = ({
  label,
  onClick,
}: {
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const classes = useStyles()

  return (
    <Button
      className={classes.actionButton}
      variant="contained"
      color="primary"
      onClick={onClick}
      data-cy={`${TestID.ACTION_BUTTON}-${label}`}
    >
      {label}
    </Button>
  )
}
