import { combine, createEvent, createStore, sample } from "effector";
import { createForm } from "effector-forms";

import {
  executeThrottleRequestFx,
  executeThrottleRequestsFx,
  showErrorMessageFx,
  showSuccessfullMessageFx,
} from "@/effects";
import { signClientWitCookieFx } from "@/effects/auth";
import { RequestResult } from "@/entities";
import {
  buildInitialThrottleRequestParams,
  buildRepeatThrottleRequestParams,
  buildResults,
} from "./utils";

const REQUESTS_AMOUNT = parseInt(
  process.env.NEXT_PUBLIC_REQUESTS_AMOUNT ?? "",
  10,
);

if (Number.isNaN(REQUESTS_AMOUNT)) {
  throw new Error("REQUESTS_AMOUNT env variable should be defined");
}

const throttleTestInitiated = createEvent();
const newRequestsSent = createEvent<{ amount: number }>();

export const form = createForm({
  fields: {
    rateLimit: {
      init: 0,
    },
  },
  validateOn: ["submit"],
});

const $requestsSent = createStore(0);
const $concurrentRequests = createStore(0);
export const $results = createStore<RequestResult[]>([]);

$requestsSent.reset(form.formValidated);
$concurrentRequests.reset(form.formValidated);
$results.reset(form.formValidated);

export const $loading = combine(
  [signClientWitCookieFx.pending, executeThrottleRequestFx.pending],
  (tuple) => tuple.some(Boolean),
);

sample({
  clock: form.formValidated,
  fn: ({ rateLimit }) => rateLimit,
  target: signClientWitCookieFx,
});

sample({
  clock: signClientWitCookieFx.doneData,
  target: throttleTestInitiated,
});

sample({
  clock: throttleTestInitiated,
  source: {
    requestsSent: $requestsSent,
    rateLimit: form.fields.rateLimit.$value,
  },
  fn: ({ requestsSent, rateLimit }) =>
    buildInitialThrottleRequestParams({
      requestsSent,
      rateLimit,
      throttleTestInitiated,
    }),
  target: [executeThrottleRequestsFx, newRequestsSent],
});

sample({
  clock: newRequestsSent,
  source: $requestsSent,
  fn: (requestsSent, { amount }) => requestsSent + amount,
  target: $requestsSent,
});

sample({
  clock: newRequestsSent,
  source: $concurrentRequests,
  fn: (concurrentRequests, { amount }) => concurrentRequests + amount,
  target: $concurrentRequests,
});

sample({
  clock: [executeThrottleRequestFx.done, executeThrottleRequestFx.fail],
  source: { concurrentRequests: $concurrentRequests },
  fn: ({ concurrentRequests }) => concurrentRequests - 1,
  target: $concurrentRequests,
});

sample({
  clock: [executeThrottleRequestFx.done, executeThrottleRequestFx.fail],
  source: {
    requestsSent: $requestsSent,
    rateLimit: form.fields.rateLimit.$value,
    concurrentRequests: $concurrentRequests,
  },
  fn: ({ requestsSent, rateLimit, concurrentRequests }) =>
    buildRepeatThrottleRequestParams({
      requestsSent,
      rateLimit,
      concurrentRequests,
      throttleTestInitiated,
    }),
  target: throttleTestInitiated,
});

sample({
  clock: executeThrottleRequestFx.fail,
  source: { results: $results },
  fn: ({ results }, { params }) => buildResults({ results }, { params }, false),
  target: $results,
});

sample({
  clock: executeThrottleRequestFx.done,
  source: { results: $results },
  fn: ({ results }, { params }) => buildResults({ results }, { params }, true),
  target: $results,
});

sample({
  clock: [signClientWitCookieFx.failData],
  target: showErrorMessageFx,
});

sample({
  clock: $results,
  filter: (results) => results.length >= REQUESTS_AMOUNT,
  fn: () => "Throttling Test Done!",
  target: showSuccessfullMessageFx,
});
