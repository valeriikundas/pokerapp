import { makeStyles, Theme } from "@material-ui/core"
import { colorFifth, colorThird } from "./../../style/variables.style"

export default makeStyles((theme: Theme) => ({
  player: {
    position: "absolute",
    border: "solid 2px",
    margin: "5px",
    backgroundColor: colorThird,
    borderColor: "#335855",

    "&:nth-child(1)": {
      top: "50%",
      transform: "translatex(-60%)",
    },

    "&:nth-child(2)": {
      top: "5%",
      transform: "translatex(-40%)",
    },

    "&:nth-child(3)": {
      top: "5%",
      left: "20%",
      transform: "translatex(0%) translatey(-55%)",
    },

    "&:nth-child(4)": {
      top: "5%",
      right: "20%",
      transform: "translatey(-55%)",
    },

    "&:nth-child(5)": {
      top: "10%",
      right: "0",
      transform: "translatex(40%)",
    },

    "&:nth-child(6)": {
      right: "0",
      top: "50%",
      transform: "translatex(60%)",
    },

    "&:nth-child(7)": {
      right: "10%",
      bottom: "0",
      transform: "translatex(-10%) translatey(40%)",
    },

    "&:nth-child(8)": {
      bottom: "0",
      left: "43%",
      transform: "translatey(65%)",
    },

    "&:nth-child(9)": {
      bottom: "0",
      left: "10%",
      transform: "translatex(10%) translatey(40%)",
    },
  },

  playerInfo: {
    textAlign: "center",
    fontSize: "20px",
    color: colorFifth,
    // color: "#ffffff",
    // width: "12em",
    // height: "15%",
    border: "1px solid #434144",
    // backgroundColor: "#222222ab !important",
    // borderRadius: "20px",
  },
}))
