"use client";

export const TIMEOUT_MS = parseInt(
  process.env.NEXT_PUBLIC_TIMEOUT_MS ?? "",
  10,
);

export const REQUESTS_AMOUNT = parseInt(
  process.env.NEXT_PUBLIC_REQUESTS_AMOUNT ?? "",
  10,
);

if (Number.isNaN(REQUESTS_AMOUNT)) {
  throw new Error("REQUESTS_AMOUNT env variable should be defined");
}

if (Number.isNaN(TIMEOUT_MS)) {
  throw new Error("NEXT_PUBLIC_TIMEOUT_MS env variable should be defined");
}
