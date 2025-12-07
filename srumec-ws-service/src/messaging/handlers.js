import { chatService } from "#root/services/chats.js";
import { eventService } from "#root/services/events.js";
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

export async function onEventCreated(content) {
  try {
    const event = content?.event;
    if (!event) return;

    await eventService.sendEventCreated({
      id: event.id,
      lat: event.latitude,
      long: event.longitude,
      organizer_ref: event.organizer_ref,
      consumers: null,
    });
  } catch (e) {
    throw produceFail("4IMHS6QZZNAZVMMV", e);
  }
}

export async function onEventUpdated(content) {
  try {
    const event = content?.event;
    if (!event) return;

    await eventService.sendEventUpdated({
      id: event.id,
      lat: event.latitude,
      long: event.longitude,
      organizer_ref: event.organizer_ref,
      consumers: null,
    });
  } catch (e) {
    throw produceFail("lu96CjZradZCeJ0W", e);
  }
}

export async function onEventDeleted(content) {
  try {
    const msgId = content?.id;
    if (!msgId) return;

    await eventService.sendEventDeleted({
      id: msgId,
      consumers: null,
    });
  } catch (e) {
    throw produceFail("rETCMb4l1Ucc5Kdm", e);
  }
}
