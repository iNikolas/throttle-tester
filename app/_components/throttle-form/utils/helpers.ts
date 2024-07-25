import { limits } from "../config";

export function sanitizeRateLimitInput(input: string): number {
  const result = parseInt(input, 10);

  if (Number.isNaN(result) || result < limits.min) {
    return limits.min;
  }

  if (result > limits.max) {
    return limits.max;
  }

  return result;
}
