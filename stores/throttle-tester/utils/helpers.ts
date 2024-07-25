import { Event } from "effector";
import { RequestResult } from "@/entities";

const REQUESTS_AMOUNT = parseInt(
  process.env.NEXT_PUBLIC_REQUESTS_AMOUNT ?? "",
  10,
);

if (Number.isNaN(REQUESTS_AMOUNT)) {
  throw new Error("REQUESTS_AMOUNT env variable should be defined");
}

export function buildInitialThrottleRequestParams({
  requestsSent,
  rateLimit,
  throttleTestInitiated,
}: {
  requestsSent: number;
  rateLimit: number;
  throttleTestInitiated: Event<void>;
}) {
  const remainedRequests = REQUESTS_AMOUNT - requestsSent;
  const batchAmount = Math.min(remainedRequests, rateLimit);

  return {
    rateLimit,
    amount: batchAmount,
    from: requestsSent + 1,
    repeat: throttleTestInitiated,
  };
}

export function buildRepeatThrottleRequestParams({
  requestsSent,
  rateLimit,
  concurrentRequests,
  throttleTestInitiated,
}: {
  requestsSent: number;
  rateLimit: number;
  concurrentRequests: number;
  throttleTestInitiated: Event<void>;
}) {
  const remainedRequests = REQUESTS_AMOUNT - requestsSent;
  const batchAmount = Math.min(
    remainedRequests,
    rateLimit - concurrentRequests,
  );

  return {
    rateLimit,
    amount: batchAmount,
    from: requestsSent + 1,
    repeat: throttleTestInitiated,
  };
}

export function buildResults(
  { results }: { results: RequestResult[] },
  { params }: { params: number },
  isSuccessful: boolean,
) {
  return [
    ...results,
    {
      index: params,
      isSuccessful,
      doneDate: new Date().toISOString(),
    },
  ];
}
