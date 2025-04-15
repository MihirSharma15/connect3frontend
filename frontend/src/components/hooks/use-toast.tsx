import { toast as neoToast } from "sonner";

enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const toast = (notification: { title: string; description?: string; type?: ToastType }) => {
  switch (notification.type) {
    case ToastType.SUCCESS:
      neoToast.success(notification.title, {
        description: notification.description,
      });
      break;
    case ToastType.ERROR:
      neoToast.error(notification.title, {
        description: notification.description,
      });
      break;
    case ToastType.WARNING:
      neoToast.warning(notification.title, {
        description: notification.description,
      });
      break;
    case ToastType.INFO:
      neoToast.info(notification.title, {
        description: notification.description,
      });
      break;
    default:
      neoToast(notification.title, {
        description: notification.description,
      });
      break;
  }
};

export { toast, ToastType };