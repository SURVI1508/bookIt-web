import toast from "react-hot-toast";

type ToastMessage = string;

const toastStyle: React.CSSProperties = {
  background: "#000",
  fontSize: "14px",
  color: "#FFFF",
  borderRadius: "5px",
};

export const successToast = (message: ToastMessage): void => {
  toast.success(message, {
    duration: 1500,
    style: toastStyle,
  });
};

export const errorToast = (message: ToastMessage): void => {
  toast.error(message, {
    duration: 1500,
    style: toastStyle,
  });
};

export const alertToast = (message: ToastMessage): void => {
  toast(message, {
    duration: 1500,
    icon: "⚠️",
    style: toastStyle,
  });
};
