import { createEffect } from "effector";

import { signClient } from "@/api";

export const signClientWitCookieFx = createEffect(async () => {
  await signClient();
});
