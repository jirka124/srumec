import { rabbit } from "#lib/rabbit.js";
import { config } from "#root/config/env.js";
import { logger } from "#lib/log/log.js";

export async function publishChatMessageCreated(message) {
  await rabbit.publish(config.chatsExchange, "chat.message.created", {
    type: "chat.message.created",
    message,
  });

  logger.info(`Published chat.message.created for ${message.id}`);
}
