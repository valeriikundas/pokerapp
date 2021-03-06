import React from "react";
import socketIOClient from "socket.io-client";
import { showInfoNotification } from "../components/Common/notifications";
import {
  getAllMessagesFromLocalStorage,
  putMessageToLocalStorage,
} from "./mockSockets";

const SOCKETIO_ENDPOINT = "http://localhost:5000/";

const TEST: boolean = process.env.MOCK_SOCKETS !== undefined;

export type SocketMessage = Record<string, unknown>;

const useRealSockets = (
  onReceiveSocketMessage: (socketMessage: SocketMessage) => void
) => {
  const socket = socketIOClient(SOCKETIO_ENDPOINT);

  socket.on("connect", () => {
    console.log("connect event");
  });

  socket.on("disconnect", () => {
    console.log("disconnect event");
  });

  socket.on("json", (data: SocketMessage) => {
    console.log("on on on data", data);
    onReceiveSocketMessage(data);
  });

  const sendMessage = (message: string) => {
    socket.send(message);
  };

  return {
    sendMessage,
  };
};

const useMockSockets = (
  onReceiveSocketMessage: (socketMessage: SocketMessage) => void
) => {
  const sendMessage = (message: string) => {
    showInfoNotification(`sendMessage ${message}`);
    putMessageToLocalStorage(message);
  };

  React.useEffect(() => {
    while (true) {
      const messages = getAllMessagesFromLocalStorage();
      console.log("messages", messages);

      messages.forEach((msg) => {
        onReceiveSocketMessage(msg);
      });
    }
  }, []);

  return {
    sendMessage,
  };
};

export const useSockets = TEST ? useMockSockets : useRealSockets;
