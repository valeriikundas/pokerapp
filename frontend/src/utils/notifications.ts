import { toast } from "react-toastify"

export const showInfoNotification = (message: string) =>
  toast(message, { type: "info" })

export const showErrorNotification = (message: string) =>
  toast(message, { type: "error" })
