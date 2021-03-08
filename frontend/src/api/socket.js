const socket = require("websocket")
const W3CWebSocket = socket.w3cwebsocket

export default function () {
  const client = new W3CWebSocket("ws://127.0.0.1:8000")

  function userLoggedIn(username) {
    client.send(
      JSON.stringify({
        username,
        type: "userevent",
      })
    )
  }

  function sendChanges(data, username) {
    client.send(
      JSON.stringify({
        ...data,
        type: "contentevent",
        username: username,
      })
    )
  }

  function receiveChanges() {
    client.onopen = () => {
      console.log("WebSocket Client Connected")
    }
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data)
      const stateToChange = {}
      // if (dataFromServer.type === "userevent") {
      //     stateToChange.currentUsers = Object.values(dataFromServer.data.users);
      // } else if (dataFromServer.type === "contentevent") {
      //     stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
      // }
      // stateToChange.userActivity = dataFromServer.data.userActivity;
      return stateToChange
    }
  }

  return {
    userLoggedIn,
    sendChanges,
    receiveChanges,
  }
}
