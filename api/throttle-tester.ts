import { fetchWithError } from "@/utils";
import { api } from "./config";

export async function executeThrottleRequest(
  requestIndex: number,
): Promise<number> {
  await fetchWithError(api, {
    method: "POST",
    body: JSON.stringify({ requestIndex }),
  });

  return requestIndex;
}
