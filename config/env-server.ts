import { getEnvVar } from "@/utils";

export const REQUEST_LIMIT = parseInt(getEnvVar("REQUEST_LIMIT"), 10);
export const MIN_DELAY_MS = parseInt(getEnvVar("MIN_DELAY_MS"), 10);
export const MAX_DELAY_MS = parseInt(getEnvVar("MAX_DELAY_MS"), 10);
export const REQUEST_WINDOW_MS = parseInt(getEnvVar("REQUEST_WINDOW_MS"), 10);
