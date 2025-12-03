import { rabbit } from "#lib/rabbit.js";
import { expireController } from "#controllers/expire.js";
import { logger } from "#lib/log/log.js";
import { wrapMessageHandler } from "#lib/log/messageLog.js";

export async function registerRoutes() {
  const queue = "expire";

  // consume unified queue
  await rabbit.consume(
    queue,
    wrapMessageHandler(async (content, ctx) => {
      switch (content.type) {
        case "event.created":
          return expireController.onEventCreated(content);
        case "event.updated":
          return expireController.onEventUpdated(content);
        case "event.deleted":
          return expireController.onEventDeleted(content);
        default:
          logger.warn(`Unknown message type: ${content.type}`);
      }
    })
  );
}
