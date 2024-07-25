"use client";

import { useForm } from "effector-forms";
import { useUnit } from "effector-react";
import React from "react";

import { throttleTesterModel } from "@/stores/throttle-tester";

import { limits } from "./config";
import { sanitizeRateLimitInput } from "./utils";

const REQUESTS_AMOUNT = parseInt(
  process.env.NEXT_PUBLIC_REQUESTS_AMOUNT ?? "",
  10,
);

export function ThrottleForm() {
  const { fields, submit } = useForm(throttleTesterModel.form);
  const loading = useUnit(throttleTesterModel.$loading);
  const displayedResults = useUnit(throttleTesterModel.$results);
  const processing =
    displayedResults.length !== 0 && displayedResults.length < REQUESTS_AMOUNT;

  return (
    <div className="max-w-lg mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-center text-primary">
        Concurrency & Rate Limiter
      </h2>
      <p className="text-base-content mb-6 text-center">
        Configure the number of concurrent requests and rate limits. Enter a
        number between 0 and 100, then start the process.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
      >
        <div className="form-control">
          <div className="label">
            <span className="label-text">Concurrency & Rate Limit</span>
          </div>
          <input
            type="number"
            value={fields.rateLimit.value}
            onChange={(e) =>
              fields.rateLimit.onChange(sanitizeRateLimitInput(e.target.value))
            }
            placeholder={`Enter number (${limits.min}-${limits.max})`}
            className="input input-bordered input-primary w-full"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary w-full"
        >
          {processing && <span className="loading loading-spinner" />}
          {processing && (loading ? "Running..." : "Paused...")}
          {!processing && "Start"}
        </button>
      </form>
    </div>
  );
}
