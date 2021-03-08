import React from "react"
import socketIOClient from "socket.io-client"
import { assert } from "../utils/asserts"
import { showInfoNotification } from "../utils/notifications"
import {
  clearMessagesInLocalStorage,
  getAllMessagesFromLocalStorage,
  putMessageToLocalStorage,
} from "./mockSockets"

const SOCKETIO_ENDPOINT = "http://localhost:5000/"

const TEST: boolean = true

export type SocketMessage = Record<string, unknown>

const useRealSockets = (
  onReceiveSocketMessage: (socketMessage: SocketMessage) => Promise<void>
) => {
  const socket = socketIOClient(SOCKETIO_ENDPOINT)

  socket.on("connect", () => {
    console.log("connect event")
  })

  socket.on("disconnect", () => {
    console.log("disconnect event")
  })

  socket.on("json", (data: SocketMessage) => {
    onReceiveSocketMessage(data)
  })

  const sendMessage = (message: SocketMessage) => {
    socket.send(message)
  }

  return {
    sendMessage,
  }
}

const useMockSockets = (
  onReceiveSocketMessage: (socketMessage: SocketMessage) => Promise<void>
) => {
  const sendMessage = (message: SocketMessage) => {
    showInfoNotification(`sendMessage ${message}`)
    putMessageToLocalStorage(message)
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      const messages = getAllMessagesFromLocalStorage()

      messages.forEach((msg) => {
        assert(typeof msg === "object" && msg)

        onReceiveSocketMessage(msg as Record<string, unknown>)
      })
      clearMessagesInLocalStorage()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    sendMessage,
  }
}

export const useSockets = TEST ? useMockSockets : useRealSockets
