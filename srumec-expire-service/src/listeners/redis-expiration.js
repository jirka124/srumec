import { redisSub } from "#lib/redis.js";
import { expireController } from "#controllers/expire.js";
import { logger } from "#lib/log/log.js";

export async function registerRedisExpirationListener() {
  await redisSub.pSubscribe("__keyevent@*__:expired", async (expiredKey) => {
    if (!expiredKey.startsWith("exp:")) return;

    await expireController.onKeyExpired(expiredKey);
  });

  logger.info("Redis expiration listener registered");
}
