import { service as directRoomService } from "#services/directRoomService.js";
import { service as chatGroupMemberService } from "#services/chatGroupMemberService.js";
import { produceFail } from "#lib/fail/fail.js";
import { rabbit } from "#lib/rabbit.js";
import { logger } from "#lib/log/log.js";

export async function onChatMessageGetConsumers(content, ctx) {
  try {
    const { room_ref, msg_type } = content;
    if (!room_ref || !msg_type) return;

    let consumers = [];

    if (msg_type === "direct") {
      const room = await directRoomService.getOneDirectRoom({ id: room_ref });

      if (!room) {
        logger.warn(`Direct room not found: ${room_ref}`);
        consumers = [];
      } else {
        consumers = [room.user_1_ref, room.user_2_ref];
      }
    } else {
      // msg_type === "group"
      const members = await chatGroupMemberService.getAllMembers({
        group_ref: room_ref,
      });
      consumers = members.map((m) => m.user_ref);
    }

    await rabbit.answerRPC(ctx, consumers);
  } catch (e) {
    await rabbit.answerRPC(ctx, []);
    throw produceFail("YouizOnxAcqsIdkh", e);
  }
}
