import { rabbit } from "#lib/rabbit.js";
import { onChatMessageGetConsumers } from "#messaging/handlers.js";
import { wrapMessageHandler } from "#lib/log/messageLog.js";

export async function registerMessaging() {
  const queueName = "chats";

  await rabbit.consume(
    queueName,
    wrapMessageHandler(async (content, ctx) => {
      switch (content.type) {
        case "chat.message.get-consumers":
          return onChatMessageGetConsumers(content, ctx);
        default:
          logger.warn(`Unknown message type: ${content.type}`);
      }
    })
  );
}
