import { chatService } from "#root/services/chats.js";
import { produceFail } from "#lib/fail/fail.js";
import { publishChatMessageGetConsumers } from "#messaging/publisher.js";

export async function onChatMessageCreated(content) {
  try {
    const msg = content?.message;
    if (!msg) return;

    const consumers = await publishChatMessageGetConsumers({
      room_ref: msg.room_ref,
      msg_type: msg.type,
    });

    await chatService.sendChatMessageCreated({
      id: msg.id,
      room_ref: msg.room_ref,
      type: msg.type,
      consumers,
    });
  } catch (e) {
    throw produceFail("kl70zfTSDPDd7QeF", e);
  }
}
