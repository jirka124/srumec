import { rabbit } from "#lib/rabbit.js";
import {
  onChatMessageCreated,
  onEventCreated,
  onEventUpdated,
  onEventDeleted,
} from "#messaging/handlers.js";
import { wrapMessageHandler } from "#lib/log/messageLog.js";

export async function registerMessaging() {
  const queueName = "ws";

  await rabbit.consume(
    queueName,
    wrapMessageHandler(async (content, ctx) => {
      switch (content.type) {
        case "chat.message.created":
          return onChatMessageCreated(content);
        case "event.created":
          return onEventCreated(content);
        case "event.updated":
          return onEventUpdated(content);
        case "event.deleted":
          return onEventDeleted(content);
        default:
          logger.warn(`Unknown message type: ${content.type}`);
      }
    })
  );
}
