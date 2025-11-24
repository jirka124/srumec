import z from "zod";
import { UUID } from "#validators/common.js";

export const fields = {
  id: UUID,
  event_ref: UUID.meta({
    description: "Event this comment belongs to",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  user_ref: UUID.meta({
    description: "User who created the comment",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  reply_to_ref: UUID.nullable().meta({
    description: "Parent comment (if this is a reply)",
    examples: ["a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11", null],
  }),
  content: z.string().min(1).meta({
    description: "Comment text",
    example: "Hello, this is a comment.",
  }),
  create_time: z.iso.datetime({ offset: true }).meta({
    description: "When was comment created ISO datetime string",
    example: "2025-11-22T21:28:46.533Z",
  }),
};

export const CommentSchema = z
  .object({
    id: fields.id,
    event_ref: fields.event_ref,
    user_ref: fields.user_ref,
    reply_to_ref: fields.reply_to_ref,
    content: fields.content,
    create_time: fields.create_time,
  })
  .meta({
    id: "CommentSchema",
    description: "Comment Schema",
  });

export const CommentCreateReqSchema = z
  .object({
    id: fields.id.optional(),
    event_ref: fields.event_ref,
    user_ref: fields.user_ref,
    reply_to_ref: fields.reply_to_ref.optional().default(null),
    content: fields.content,
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "CommentCreateReq",
    description: "Schema for creating a new comment",
  });

export const CommentUpdateReqSchema = z
  .object({
    id: fields.id,
    event_ref: fields.event_ref.optional(),
    user_ref: fields.user_ref.optional(),
    reply_to_ref: fields.reply_to_ref.optional(),
    content: fields.content.optional(),
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "CommentUpdateReq",
    description: "Schema for updating existing comment",
  });

export const CommentGetAllReqSchema = z
  .object({
    event_ref: UUID,
  })
  .meta({
    id: "CommentGetAllReq",
    description: "Get all comments for an event",
  });

export const CommentDeleteReqSchema = z
  .object({
    id: UUID,
  })
  .meta({
    id: "CommentDeleteReq",
    description: "Delete a comment by ID",
  });
