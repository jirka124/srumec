import { rabbit } from "#lib/rabbit.js";
import { handleEventExpired } from "#messaging/handlers.js";
import { wrapMessageHandler } from "#lib/log/messageLog.js";

export async function registerMessaging() {
  const queueName = "events";

  await rabbit.consume(
    queueName,
    wrapMessageHandler(async (msg, ctx) => {
      await handleEventExpired(msg);
    })
  );
}
