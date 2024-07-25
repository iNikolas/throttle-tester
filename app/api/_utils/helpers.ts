import { NextRequest, NextResponse } from "next/server";

import { MAX_DELAY_MS, MIN_DELAY_MS } from "@/config/env-server";

export async function post(req: NextRequest) {
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
