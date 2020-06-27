import { ActionType } from "../types";
import api from "./api";

const act = (
  tableId: number,
  username: string,
  type: ActionType,
  size?: number
) => {
  api.post(`http://localhost:5000/api/act/${tableId}/${username}`, {
    type: type,
    size: size,
  });
};

export default act;
