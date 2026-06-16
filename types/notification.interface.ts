export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  message?: string;
  title?: string;
  duration?: number;
};
