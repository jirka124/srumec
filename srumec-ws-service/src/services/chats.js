import { logger } from "#lib/log/log.js";
import { wsServer } from "#ws/server.js";

export const chatService = {
  async sendChatMessageCreated({ id, room_ref, type, consumers }) {
    logger.info('Executing "sendChatMessageCreated" service with params: ', {
      id,
      room_ref,
      consumers,
    });

    wsServer.sendToClientsJSON(consumers, {
      event: "chat.message.created",
      data: { id, room_ref, type },
    });

    logger.info('Executed "sendChatMessageCreated" service with params: ', {
      id,
      room_ref,
      consumers,
    });

    return consumers;
  },
};
