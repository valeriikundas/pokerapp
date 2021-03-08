import { ActionType } from "../models/game"
import apiClient from "./apiClient"

const act = (
  tableId: number,
  username: string,
  type: ActionType,
  size?: number
) => {
  apiClient.post(`/act/${tableId}/${username}`, {
    type: type,
    size: size,
  })
}

export default act
