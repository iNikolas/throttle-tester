import { NextRequest, NextResponse } from "next/server";

import { REQUEST_LIMIT, REQUEST_WINDOW_MS } from "@/config/env-server";

const rateLimitMap = new Map();

export function rateLimiterMiddleware(handler: (req: NextRequest) => void) {
  return (req: NextRequest) => {
    const ip =
      req.headers.get("X-Real-Ip") ?? req.headers.get("X-Forwarded-For");

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > REQUEST_WINDOW_MS) {
      ipData.count = 0;
      ipData.lastReset = Date.now();
    }

    if (ipData.count >= REQUEST_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    ipData.count += 1;

    return handler(req);
  };
}
