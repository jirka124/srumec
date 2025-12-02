import { createClient } from "redis";
import { config } from "#root/config/env.js";
import { logger } from "#lib/log/log.js";

export const redis = createClient({
  url: config.redisUrl,
});
export const redisSub = redis.duplicate();

export async function connectRedis() {
  redis.on("error", (err) => console.error("Redis error:", err));
  redisSub.on("error", (err) => console.error("RedisSub error:", err));

  await redis.connect();
  await redisSub.connect();

  logger.info("Redis connected");
}
