import { connectRedis } from "#lib/redis.js";
import { connectRabbit } from "#lib/rabbit.js";
import { registerRoutes } from "#messages/expire.js";
import { registerRedisExpirationListener } from "#listeners/redis-expiration.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

async function main() {
  await connectRedis();
  await connectRabbit();

  await registerRoutes();
  await registerRedisExpirationListener();

  logger.info("expire-service started");
}

const finalErrorCatch = (e) => {
  const err = produceFail("rL1h3Y7SJ11lL0Y2", e);
  logger[err.logger.literal](err.serverPrepare());
};

main().catch((e) => {
  finalErrorCatch(e);
});

process.on("unhandledRejection", (e) => {
  finalErrorCatch(e);
});

process.on("uncaughtException", (e) => {
  finalErrorCatch(e);
});
