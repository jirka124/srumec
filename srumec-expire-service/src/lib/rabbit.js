import { RabbitClient } from "@srumec/rabbitmq-client";
import { config } from "#root/config/env.js";
import { logger } from "#lib/log/log.js";

export const rabbit = new RabbitClient(config.rabbitUrl);

export async function connectRabbit() {
  await rabbit.connect();

  await rabbit.assertExchange(config.eventsExchange, "direct", {
    durable: true,
  });
  await rabbit.assertExchange(config.expireExchange, "direct", {
    durable: true,
  });

  logger.info("RabbitMQ connected");
}
