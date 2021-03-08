import Slider from "@material-ui/core/Slider"
import React from "react"
import { assert } from "src/utils/asserts"
import { ActionType, RequestAction } from "../../models/game"
import { ActionButton } from "./ActionButton"
import useStyles from "./style"

interface ActionPanelProps {
  actions: RequestAction[]
  onAction: (type: ActionType, size?: number) => void
}

const ActionPanel = ({ actions, onAction: handleAction }: ActionPanelProps) => {
  const classes = useStyles()

  const [raiseSize, setRaiseSize] = React.useState<number>()

  const getAndSetMinRaiseSize = () => {
    const raiseAction = actions.find(
      (action) => action.type === ActionType.RAISE
    )
    if (!raiseAction) {
      return
    }
    assert(raiseAction.min != null, "raiseAction does not have min border")
    if (!raiseAction.min) {
      return
    }
    setRaiseSize(raiseAction.min)
  }

  React.useEffect(() => {
    getAndSetMinRaiseSize()
  }, [actions])

  const handleSliderChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    assert(typeof newValue === "number")
    setRaiseSize(newValue)
  }

  const renderAction = (button: RequestAction): JSX.Element => {
    switch (button.type) {
      case ActionType.FOLD:
      case ActionType.CHECK:
        return (
          <ActionButton
            label={button.type}
            onClick={() => handleAction(button.type)}
          />
        )

      case ActionType.CALL:
        return (
          <ActionButton
            label={`CALL ${button.size}`}
            onClick={() => handleAction(ActionType.CALL, button.size)}
          />
        )

      case ActionType.RAISE:
        return (
          <div className={classes.buttons}>
            <ActionButton
              label={`RAISE ${raiseSize}`}
              onClick={() => handleAction(ActionType.RAISE, raiseSize)}
            />
            <Slider
              value={raiseSize}
              onChange={handleSliderChange}
              defaultValue={button.max}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={button.min}
              max={button.max}
            />
          </div>
        )
    }
  }

  return <div className={classes.wrapper}>{actions.map(renderAction)}</div>
}

export default ActionPanel
