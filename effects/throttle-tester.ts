import { createEffect, Event } from "effector";

import { executeThrottleRequest } from "@/api";

const TIMEOUT_MS = parseInt(process.env.NEXT_PUBLIC_TIMEOUT_MS ?? "", 10);

if (Number.isNaN(TIMEOUT_MS)) {
  throw new Error("NEXT_PUBLIC_TIMEOUT_MS env variable should be defined");
}

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
