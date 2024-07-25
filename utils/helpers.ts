import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export async function fetchWithError<T>(
  url: string,
  { body, headers, ...options }: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...headers },
    body,
    ...options,
  });
  if (!response.ok) {
    const { status } = response;
    const data = await response.json();

    throw new Error(data.message ?? `Status ${status}: Failed to fetch`);
  }

  const data = await response.json();

  return data;
}
