import { NextRequest, NextResponse } from "next/server";

import {
  CLIENT_ID,
  REQUEST_LIMIT,
  REQUEST_WINDOW_MS,
} from "@/config/env-server";
import { redis } from "@/lib";

async function getRateLimitData(ip: string) {
  const rateLimitData = await redis.hgetall(`${CLIENT_ID}:${ip}`);
  return rateLimitData;
}

async function setRateLimitData(ip: string, count: number, lastReset: number) {
  await redis.hmset(`${CLIENT_ID}:${ip}`, {
    count: count.toString(),
    lastReset: lastReset.toString(),
  });
}

async function resetRateLimitData(ip: string) {
  await redis.del(`${CLIENT_ID}:${ip}`);
}

export function rateLimiterMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get("X-Real-Ip") ?? req.headers.get("X-Forwarded-For");

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to determine IP address" },
        { status: 400 },
      );
    }

    const rateLimitData = await getRateLimitData(ip);
    let count = 0;
    let lastReset = Date.now();

    if (rateLimitData.count && rateLimitData.lastReset) {
      count = parseInt(rateLimitData.count, 10);
      lastReset = parseInt(rateLimitData.lastReset, 10);
    }

    if (Date.now() - lastReset > REQUEST_WINDOW_MS) {
      count = 0;
      lastReset = Date.now();
      await resetRateLimitData(ip);
    }

    if (count >= REQUEST_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    count += 1;
    await setRateLimitData(ip, count, lastReset);

    return handler(req);
  };
}
