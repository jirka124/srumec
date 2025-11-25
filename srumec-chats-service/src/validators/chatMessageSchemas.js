import z from "zod";
import { UUID } from "#validators/common.js";

export const fields = {
  id: UUID,
  room_ref: UUID.meta({
    description: "Reference to Room where message was sent",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  user_ref: UUID.meta({
    description: "Reference to User who sent the message",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  message: z.string().min(1).max(5000).meta({
    description: "Contents of message",
    example: "How was your day?",
  }),
  sent_time: z.iso.datetime({ offset: true }).meta({
    description: "When the message was sent (ISO datetime string)",
    example: "2025-11-22T21:28:46.533Z",
  }),
};

export const ChatMessageSchema = z.object({
  id: fields.id,
  room_ref: fields.room_ref,
  user_ref: fields.user_ref,
  message: fields.message,
  sent_time: fields.sent_time,
});

export const CreateMessageReq = z.object({
  id: fields.id.optional(),
  room_ref: fields.room_ref,
  user_ref: fields.user_ref,
  message: fields.message,
  sent_time: fields.sent_time.optional(),
});
export const CreateMessageRes = ChatMessageSchema;

export const UpdateMessageReq = z.object({
  id: fields.id,
  room_ref: fields.room_ref.optional(),
  user_ref: fields.user_ref.optional(),
  message: fields.message.optional(),
  sent_time: fields.sent_time.optional(),
});
export const UpdateMessageRes = ChatMessageSchema;

export const GetAllMessagesReq = z.object({
  room_ref: fields.room_ref,
});
export const GetAllMessagesRes = z.array(ChatMessageSchema);

export const DeleteOneMessageReq = z.object({
  id: fields.id,
});
