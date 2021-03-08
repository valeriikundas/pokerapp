import { assert } from "../utils/asserts"

const key = "socketio"

export const putMessageToLocalStorage = (msg: unknown) => {
  const item = localStorage.getItem(key)
  const json = item ? JSON.parse(item) : []

  assert(Array.isArray(json))

  json.push(msg)

  localStorage.setItem(key, JSON.stringify(json))
}

export const getAllMessagesFromLocalStorage = (): unknown[] => {
  const item = localStorage.getItem(key)

  const json = item ? JSON.parse(item) : []

  assert(Array.isArray(json))

  return json
}

export const clearMessagesInLocalStorage = () => {
  localStorage.removeItem(key)
}
