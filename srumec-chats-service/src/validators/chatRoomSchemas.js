import z from "zod";
import { UUID } from "#validators/common.js";

export const fields = {
  id: UUID,
  user_1_ref: UUID.meta({
    description: "Reference to User",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  user_2_ref: UUID.meta({
    description: "Reference to User",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  create_time: z.iso.datetime({ offset: true }).meta({
    description: "When was the room created ISO datetime string",
    example: "2025-11-22T21:28:46.533Z",
  }),
  name: z.string().min(1).max(32).meta({
    description: "Name of group room",
    example: "Yupy Nupy :)",
  }),
};

export const ChatRoomDirectSchema = z
  .object({
    id: fields.id,
    user_1_ref: fields.user_1_ref,
    user_2_ref: fields.user_2_ref,
    create_time: fields.create_time,
  })
  .meta({
    id: "ChatRoomDirectSchema",
    description: "Chat Room Direct Schema",
  });

export const ChatRoomGroupSchema = z.object({
  id: fields.id,
  name: fields.name,
  create_time: fields.create_time,
});

export const ChatRoomDirectCreateSchema = z
  .object({
    id: fields.id.optional(),
    user_1_ref: fields.user_1_ref,
    user_2_ref: fields.user_2_ref,
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "ChatRoomDirectCreateSchema",
    description: "Chat Room Direct Create Schema",
  });

export const ChatRoomGroupCreateSchema = z
  .object({
    id: fields.id.optional(),
    name: fields.name,
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "ChatRoomGroupCreateSchema",
    description: "Chat Room Group Create Schema",
  });

export const ChatRoomDirectUpdateSchema = z
  .object({
    id: fields.id,
    user_1_ref: fields.user_1_ref.optional(),
    user_2_ref: fields.user_2_ref.optional(),
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "ChatRoomDirectUpdateSchema",
    description: "Chat Room Direct Update Schema",
  });

export const ChatRoomGroupUpdateSchema = z
  .object({
    id: fields.id,
    name: fields.name.optional(),
    create_time: fields.create_time.optional(),
  })
  .meta({
    id: "ChatRoomGroupUpdateSchema",
    description: "Chat Room Group Update Schema",
  });

export const GetAllDirectRoomsReq = z.object({});
export const GetAllDirectRoomsRes = z.array(ChatRoomDirectSchema);

export const GetAllGroupRoomsReq = z.object({});
export const GetAllGroupRoomsRes = z.array(ChatRoomGroupSchema);

export const GetOneDirectRoomReq = z.object({
  id: fields.id,
});
export const GetOneDirectRoomRes = ChatRoomDirectSchema;

export const GetOneGroupRoomReq = z.object({
  id: fields.id,
});
export const GetOneGroupRoomRes = ChatRoomGroupSchema;

export const CreateOneDirectRoomReq = ChatRoomDirectCreateSchema;
export const CreateOneDirectRoomRes = ChatRoomDirectSchema;

export const CreateOneGroupRoomReq = ChatRoomGroupCreateSchema;
export const CreateOneGroupRoomRes = ChatRoomGroupSchema;

export const UpdateOneDirectRoomReq = ChatRoomDirectUpdateSchema;
export const UpdateOneDirectRoomRes = ChatRoomDirectSchema;

export const UpdateOneGroupRoomReq = ChatRoomGroupUpdateSchema;
export const UpdateOneGroupRoomRes = ChatRoomGroupSchema;

export const DeleteOneDirectRoomReq = z.object({
  id: fields.id,
});

export const DeleteOneGroupRoomReq = z.object({
  id: fields.id,
});
