import z from "zod";
import { UUID } from "#validators/common.js";

export const fields = {
  group_ref: UUID.meta({
    description: "Reference to Room of member",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  user_ref: UUID.meta({
    description: "Reference to User being member",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  role: z.enum(["guest", "admin"]).meta({
    description: "User role inside group",
    example: "admin",
  }),
  member_since: z.iso.datetime({ offset: true }).meta({
    description: "By since user is a member (ISO datetime string)",
    example: "2025-11-22T21:28:46.533Z",
  }),
};

export const ChatRoomGroupMemberSchema = z.object({
  group_ref: fields.group_ref,
  user_ref: fields.user_ref,
  role: fields.role,
  member_since: fields.member_since,
});

export const ChatRoomGroupMemberCreateSchema = z.object({
  group_ref: fields.group_ref,
  user_ref: fields.user_ref,
  role: fields.role,
  member_since: fields.member_since.optional(),
});

export const ChatRoomGroupMemberUpdateSchema = z.object({
  group_ref: fields.group_ref,
  user_ref: fields.user_ref,
  role: fields.role.optional(),
  member_since: fields.member_since.optional(),
});

export const GetAllGroupMembersReq = z.object({
  group_ref: fields.group_ref,
});
export const GetAllGroupMembersRes = z.array(fields.user_ref);

export const CreateGroupMemberReq = ChatRoomGroupMemberCreateSchema;
export const CreateGroupMemberRes = ChatRoomGroupMemberSchema;

export const UpdateGroupMemberReq = ChatRoomGroupMemberUpdateSchema;
export const UpdateGroupMemberRes = ChatRoomGroupMemberSchema;

export const DeleteGroupMemberReq = z.object({
  group_ref: fields.group_ref,
  user_ref: fields.user_ref,
});
