import { rateLimiterMiddleware } from "@/middleware";

import { post } from "./_utils";

export const POST = rateLimiterMiddleware(post);
