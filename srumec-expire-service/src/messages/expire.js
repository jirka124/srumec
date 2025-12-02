import { rabbit } from "#lib/rabbit.js";
import { config } from "#root/config/env.js";
import { expireController } from "#controllers/expire.js";
import { logger } from "#lib/log/log.js";

export async function registerRoutes() {
  const queue = "expire";

  // create binding programmatically (idempotent)
  await rabbit.bindQueue(queue, config.eventsExchange, "event.created");

  // consume events.created
  await rabbit.consume(queue, async (content, ctx) => {
    await expireController.onEventCreated(content);
  });

  logger.info(`Expire-service consuming queue "${queue}"`);
}
