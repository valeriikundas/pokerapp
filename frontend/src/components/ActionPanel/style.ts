import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },

  buttons: {
    width: "400px",
    display: "flex",
    alignItems: "center",
    marginRight: "35px",
  },

  actionButton: {
    border: "1px solid #40ffe5",
    borderRadius: "2px",
    background: "#2d7576",
    margin: "5px 15px",
    textTransform: "uppercase",
    padding: "20px 30px",
  },
});

export default useStyles;
