import { makeStyles, Theme } from "@material-ui/core"

export default makeStyles((theme: Theme) => ({
  root: {
    margin: "0",
    padding: "0",
  },

  body: {
    // background: "#222",
  },

  container: {
    margin: 200,
    // display: "flex",
    // justifyContent: "center",
    // flexDirection: "column",
    // height: "1000px",
    // height: "100vh",
  },

  containerTable: {
    // display: "flex",
    // flexGrow: 4,
    // width: "75%",
    // height: "1000px",
    // margin: "0 auto",
    // backgroundColor: "green",
    margin: "200px auto 100px",
    // paddingTop: "40px",
    // alignItems: "center",
  },

  panel: {
    // display: "flex",
    // flexGrow: 1,
    // width: "100%",
    // backgroundColor: "#2433334d",
  },

  table: {
    // flex: 1,
    width: "1000px",
    height: "500px",
    // backgroundColor: "blue",
    backgroundImage:
      "radial-gradient(rgba(78, 76, 78, 0.89), rgba(22, 20, 22, 0.87))",
    borderRadius: "220px",
    // boxShadow:
    //   "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #0ff, 0 0 80px #0ff, 0 0 90px #0ff",
    position: "relative",
  },

  cardsArea: {
    border: "3px dashed #86c5cf40",
    // display: "flex",
    // flexWrap: "wrap",
    // position: "absolute",
    margin: "0 auto",
    width: "50%",
    borderRadius: "10px",
    // marginTop: "10%",
    padding: "10px",
    // top: "47%",
    // left: "50%",
    // transform: "translateX(-50%) translateY(-50%)",
    // boxSizing: "border-box",
  },

  playerArea: {
    // position: "relative",
    // width: "100%",
    // height: "100%",
    // zIndex: 100,
    // display: "flex",
  },
}))
