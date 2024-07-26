import { NextRequest, NextResponse } from "next/server";
import {
  CLIENT_ID,
  REQUEST_LIMIT,
  REQUEST_WINDOW_MS,
} from "@/config/env-server";
import { redis } from "@/lib";

export function rateLimiterMiddleware(handler: (req: NextRequest) => void) {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get("X-Real-Ip") ??
      req.headers.get("X-Forwarded-For") ??
      "unknown_ip";

    const rateLimitKey = `${CLIENT_ID}:${ip}`;

    const currentTime = Date.now();

    const multi = redis.multi();
    multi.hmget(rateLimitKey, "count", "lastReset");
    multi.expire(rateLimitKey, REQUEST_WINDOW_MS / 1000);

    const [, result] = (await multi.exec()) as unknown as [
      unknown,
      (string | null)[],
    ];

    const [count, lastReset] = result;

    const countNum = parseInt(count ?? "0", 10);
    const lastResetNum = parseInt(lastReset ?? `${currentTime}`, 10);

    if (currentTime - lastResetNum > REQUEST_WINDOW_MS) {
      await redis.hmset(rateLimitKey, {
        count: 1,
        lastReset: currentTime,
      });
    } else if (countNum >= REQUEST_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    } else {
      await redis.hincrby(rateLimitKey, "count", 1);
    }

    return handler(req);
  };
}
