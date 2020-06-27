import socketIOClient from "socket.io-client";

const SOCKETIO_ENDPOINT = "http://localhost:5000/";

const setupEventListener = (
  setSocketEventData: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >
) => {
  const socket = socketIOClient(SOCKETIO_ENDPOINT);

  socket.on("connect", () => {
    console.log("connect event");
  });

  socket.on("disconnect", () => {
    console.log("disconnect event");
  });

  socket.on("json", (data: { [key: string]: any }) => {
    setSocketEventData(data);
  });
};

export default setupEventListener;
