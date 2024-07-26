import Redis from "ioredis";

import { REDIS_PORT } from "@/config/env-server";

export const redis = new Redis({
  port: REDIS_PORT,
});
