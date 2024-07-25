import { createEffect, Event } from "effector";

import { executeThrottleRequest } from "@/api";
import { TIMEOUT_MS } from "@/config";

export const executeThrottleRequestFx = createEffect(async (index: number) => {
  await executeThrottleRequest(index);
});

export const executeThrottleRequestsFx = createEffect(
  ({
    amount,
    from,
    rateLimit,
    repeat,
  }: {
    rateLimit: number;
    amount: number;
    from: number;
    repeat: Event<void>;
  }) => {
    if (amount >= rateLimit) {
      setTimeout(repeat, TIMEOUT_MS);
    }

    if (amount <= 0) {
      return;
    }

    Array(amount)
      .fill(0)
      .forEach((_, index) => executeThrottleRequestFx(from + index));
  },
);
