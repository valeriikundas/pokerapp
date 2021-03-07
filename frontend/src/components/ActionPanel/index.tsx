import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import React, { useEffect } from "react";
import { ActionType, RequestAction } from "../../models/game";
import useStyles from "./style";

interface ActionPanelProps {
  actions: RequestAction[];
  handleAction: (type: ActionType, size?: number) => void;
}

const ActionPanel = ({ actions, handleAction }: ActionPanelProps) => {
  const classes = useStyles();

  const [raiseSize, setRaiseSize] = React.useState(0);

  const getAndSetMinRaiseSize = () => {
    const raiseActions = actions.filter((action) => action.type === "raise");
    if (!raiseActions.length) {
      return;
    }
    const raiseAction = raiseActions[0];
    if (!raiseAction.min) {
      return;
    }
    setRaiseSize(raiseAction.min);
  };

  useEffect(() => {
    getAndSetMinRaiseSize();
  }, [actions]);

  const handleSliderChange = (event: any, newValue: any) => {
    setRaiseSize(newValue);
  };

  return (
    <div className={classes.wrapper}>
      {actions.map((button: any, index: number) =>
        button.type === "call" ? (
          <Button
            key={index}
            className={classes.actionButton}
            variant="contained"
            color="primary"
            onClick={() => {
              handleAction("call", button.size);
            }}
          >
            call {button.size}
          </Button>
        ) : button.type === "raise" ? (
          <div className={classes.buttons} key={index}>
            <Button
              key={index}
              className={classes.actionButton}
              variant="contained"
              color="primary"
              onClick={() => {
                handleAction("raise", raiseSize);
              }}
            >
              RAISE&nbsp;{raiseSize}
            </Button>
            <Slider
              key={index + 1}
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
        ) : (
          <Button
            key={index}
            className={classes.actionButton}
            variant="contained"
            color="primary"
            onClick={() => {
              handleAction(button.type);
            }}
          >
            {button.type}
          </Button>
        )
      )}
    </div>
  );
};

export default ActionPanel;
