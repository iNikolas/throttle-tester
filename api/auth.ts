import { fetchWithError } from "@/utils";
import { api } from "./config";

export async function signClient() {
  fetchWithError(api, { method: "GET" });
}
