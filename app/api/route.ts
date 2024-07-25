import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getEnvVar } from "@/utils";
import { signClientCookie } from "./_utils";

const REQUEST_LIMIT_PER_SECOND = parseInt(
  getEnvVar("REQUEST_LIMIT_PER_SECOND"),
  10,
);
const MIN_DELAY_MS = parseInt(getEnvVar("MIN_DELAY_MS"), 10);
const MAX_DELAY_MS = parseInt(getEnvVar("MAX_DELAY_MS"), 10);
const CLIENT_ID_COOKIE_NAME = getEnvVar("CLIENT_ID_COOKIE_NAME");

const requestCounts: Map<string, number> = new Map();
const requestTimestamps: Map<string, number> = new Map();

export async function GET() {
  signClientCookie(cookies());

  return NextResponse.json({});
}

export async function POST(req: NextRequest) {
  const clientId = cookies().get(CLIENT_ID_COOKIE_NAME)?.value;

  if (!clientId) {
    return NextResponse.json(
      { error: "Use GET Method firstly to sign the client" },
      { status: 403 },
    );
  }

  const now = Date.now();

  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, 0);
    requestTimestamps.set(clientId, now);
  }

  const timestamp = requestTimestamps.get(clientId)!;
  const count = requestCounts.get(clientId)!;

  if (now - timestamp >= MAX_DELAY_MS) {
    requestCounts.set(clientId, 1);
    requestTimestamps.set(clientId, now);
  }

  if (count >= REQUEST_LIMIT_PER_SECOND) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  requestCounts.set(clientId, count + 1);

  const delay =
    Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) +
    MIN_DELAY_MS;
  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

  const { requestIndex } = await req.json();

  if (!requestIndex) {
    return NextResponse.json(
      { error: "Request index is required." },
      { status: 400 },
    );
  }

  return NextResponse.json({ index: requestIndex });
}
