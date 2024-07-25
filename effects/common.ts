import { createEffect } from "effector";
import { toast } from "react-toastify";

export const showSuccessfullMessageFx = createEffect((message: string) => {
  toast.success(message);
});

export const showErrorMessageFx = createEffect((e: Error) => {
  toast.error(e.message);
});
