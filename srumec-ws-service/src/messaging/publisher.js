import { rabbit } from "#lib/rabbit.js";
import { logger } from "#lib/log/log.js";

export async function publishChatMessageGetConsumers({ room_ref, msg_type }) {
  try {
    const consumers = rabbit.publishRPC(
      "chats_exchange",
      "trgt.chats",
      {
        type: "chat.message.get-consumers",
        room_ref,
        msg_type,
      },
      {},
      null,
      20000
    );

    logger.info(`PublishedRPC chat.message.get-consumers for `, {
      room_ref,
      msg_type,
    });
    return consumers;
  } catch (e) {
    throw produceFail("R9PNu6PDh7tCM5Xf", e);
  }
}
