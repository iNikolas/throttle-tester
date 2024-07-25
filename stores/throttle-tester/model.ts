import { combine, createEvent, createStore, sample } from "effector";
import { createForm } from "effector-forms";

import { REQUESTS_AMOUNT } from "@/config";
import {
  executeThrottleRequestFx,
  executeThrottleRequestsFx,
  showSuccessfullMessageFx,
} from "@/effects";
import { RequestResult } from "@/entities";

import {
  buildInitialThrottleRequestParams,
  buildRepeatThrottleRequestParams,
  buildResults,
} from "./utils";

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

export const $loading = combine([executeThrottleRequestFx.pending], (tuple) =>
  tuple.some(Boolean),
);

sample({
  clock: form.formValidated,
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
  clock: $results,
  filter: (results) => results.length >= REQUESTS_AMOUNT,
  fn: () => "Throttling Test Done!",
  target: showSuccessfullMessageFx,
});
