import { rabbit } from "#lib/rabbit.js";
import { config } from "#root/config/env.js";
import { logger } from "#lib/log/log.js";

export async function publishEventCreated(event) {
  await rabbit.publish(config.eventsExchange, "event.created", {
    type: "event.created",
    event,
  });

  logger.info(`Published event.created for ${event.id}`);
}

export async function publishEventUpdated(event) {
  await rabbit.publish(config.eventsExchange, "event.updated", {
    type: "event.updated",
    event,
  });

  logger.info(`Published event.updated for ${event.id}`);
}

export async function publishEventDeleted(id) {
  await rabbit.publish(config.eventsExchange, "event.deleted", {
    type: "event.deleted",
    id,
  });

  logger.info(`Published event.deleted for ${id}`);
}
