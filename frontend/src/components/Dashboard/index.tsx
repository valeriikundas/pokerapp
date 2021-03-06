import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import apiClient from "../../apis/apiClient";

const useStyles = makeStyles({
  // body: {
  //   fontFamily: "'Open Sans', sans-serif",
  //   color: "#A7A1AE",
  //   background: "#222",
  // },
  // wrapper: {
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: "100vh",
  // },
  // table: {
  //   borderRadius: "20px",
  //   boxShadow:
  //     "0 0 5px #fff,\n  0 0 10px #fff,\n  0 0 20px #fff,\n  0 0 40px #0c8787,\n  0 0 60px #0ff",
  // },
  // h1: {
  //   fontSize: "3em",
  //   fontWeight: 300,
  //   lineHeight: "1em",
  //   textAlign: "center",
  //   color: "#00FFFF",
  // },
  // h2: {
  //   fontSize: "1em",
  //   fontWeight: 300,
  //   textAlign: "center",
  //   display: "block",
  //   lineHeight: "1em",
  //   paddingBottom: "2em",
  //   color: "#00FFFF",
  // },
  // h2_a: {
  //   fontWeight: 700,
  //   textTransform: "uppercase",
  //   color: "#00FFFF",
  //   textDecoration: "none",
  // },
  // blue: { color: "#185875" },
  // yellow: { color: "#22fff0" },
  // container_th_h1: {
  //   fontWeight: "bold",
  //   fontSize: "1em",
  //   textAlign: "left",
  //   color: "#A8FFE5",
  // },
  // container_td: { padding: "1%" },
  // container: {
  //   textAlign: "left",
  //   overflow: "hidden",
  //   width: "80%",
  //   margin: "0 auto",
  //   display: "table",
  // },
  // container_th: { backgroundColor: "#083439" },
  // container_tr_nth_child_odd: { backgroundColor: "#257d83" },
  // container_tr_nth_child_even: { backgroundColor: "#12595e" },
  // container_td_first_child: { color: "#d6eeef" },
  // container_tr_hover: {
  //   backgroundColor: "#004a52",
  //   WebkitBoxShadow: "0 6px 6px -6px #0E1119",
  //   MozBoxShadow: "0 6px 6px -6px #0E1119",
  //   boxShadow: "0 6px 6px -6px #0E1119",
  // },
  // container_td_hover: {
  //   backgroundColor: "#11d9cb",
  //   color: "#134037",
  //   fontWeight: "bold",
  //   boxShadow:
  //     "#0f7f6c -1px 1px, #0a7f73 -2px 2px, #0d7f74 -3px 3px, #057f76 -4px 4px, #0d7f74 -5px 5px, #0d7f74 -6px 6px",
  //   transform: "translate3d(6px, -6px, 0)",
  //   transitionDelay: "0s",
  //   transitionDuration: "0.4s",
  //   transitionProperty: "all",
  //   transitionTimingFunction: "line",
  // },
  // "@media (max-width: 800px)": {
  //   __expression__: "(max-width: 800px)",
  //   container_td_nth_child_4: { display: "none" },
  //   container_th_nth_child_4: { display: "none" },
  // },
  // button: {
  //   background: "rgba(255, 255, 255, .1)",
  //   border: "1px solid",
  //   padding: "15px 5px",
  //   borderRadius: "25px",
  //   width: "80%",
  //   color: "#fff",
  //   display: "block",
  // },
});

// const A={
//   const classes=useStyles();
// }

type Table = {
  id: number;
};

const Dashboard = () => {
  // const classes = useStyles();

  const [redirect, setRedirect] = useState(false);
  const [tableId, setTableId] = useState(0);
  const [username, setUsername] = useState("valera");

  const [tables, setTables] = useState<Table[]>([{ id: 5 }]);

  useEffect(() => {
    // const username = window.location.href;
    // console.log("username :>> ", username);
    const fetchTables = async () => {
      const result = await apiClient.get(`/tables`);
      setTables(result.data);
    };
    fetchTables();
  }, []);

  const handleSubmit = async (id: number) => {
    // const username = window.location.href;
    // console.log("username :>> ", username);
    setTableId(id);
    // setUsername(username);

    const result = await apiClient.get(`/tables/${id}/join/${username}`);

    if (result.data["status"] === "joined") {
      setRedirect(true);
      return;
    }

    console.error(result.data);
    return;
  };

  return redirect ? (
    <Redirect
      to={{
        pathname: `/table/${tableId}`,
        state: {
          username: username,
          tableId: tableId,
        },
      }}
    />
  ) : (
    <div
    // className={styles.wrapper}
    >
      <h1>username: {username}</h1>
      <table
      // className={styles.container}
      >
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>
              <h1>Type</h1>
            </th>
            <th>
              <h1>Players</h1>
            </th>
            <th>
              <h1>Average Stack</h1>
            </th>
            <th>
              <h1>Hands/Hour</h1>
            </th> */}
            <th>join</th>
          </tr>
        </thead>
        <tbody>
          {tables
            // .sort(compare)
            .map((table, index) => (
              <tr key={index}>
                <td>{table.id}</td>
                {/* <td>{table.table_type}</td>
              <td>{table.players_count}</td>
              <td>{table.average_stack}</td>
              <td>{table.hands_per_hour}</td> */}
                <td>
                  <Button
                    type="submit"
                    variant="outlined"
                    // className={styles.button}
                    onClick={() => handleSubmit(table.id)}
                  >
                    Join Table
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
