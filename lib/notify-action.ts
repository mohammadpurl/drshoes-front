import { showNotification } from "@/app/_store/notification.store";

export function notifySuccess(message: string) {
  showNotification([{ type: "success", message }]);
}

export function notifyError(message: string) {
  showNotification([{ type: "error", message }]);
}
