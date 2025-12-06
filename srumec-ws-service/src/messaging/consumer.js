import { rabbit } from "#lib/rabbit.js";
import { onChatMessageCreated } from "#messaging/handlers.js";
import { wrapMessageHandler } from "#lib/log/messageLog.js";

export async function registerMessaging() {
  const queueName = "ws";

  await rabbit.consume(
    queueName,
    wrapMessageHandler(async (content, ctx) => {
      switch (content.type) {
        case "chat.message.created":
          return onChatMessageCreated(content);
        default:
          logger.warn(`Unknown message type: ${content.type}`);
      }
    })
  );
}
