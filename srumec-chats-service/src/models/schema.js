import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

/* =====================================================
   ENUM TYPES
===================================================== */

export const chatRoomType = pgEnum("chat_room_type", ["direct", "group"]);
export const groupRole = pgEnum("group_role", ["guest", "admin"]);

/* =====================================================
   chat_room_direct
===================================================== */

export const chatRoomDirect = pgTable("chat_room_direct", {
  id: uuid("id").primaryKey().defaultRandom(),
  user1Ref: uuid("user_1_ref").notNull(),
  user2Ref: uuid("user_2_ref").notNull(),
  createTime: timestamp("create_time", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* Unique validation — business logic only, DB constraint je v init.sql */
export const chatRoomDirectIndexes = {
  user1: (table) => table.user1Ref,
  user2: (table) => table.user2Ref,
};

/* =====================================================
   chat_room_group
===================================================== */

export const chatRoomGroup = pgTable("chat_room_group", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 32 }).notNull(),
  createTime: timestamp("create_time", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =====================================================
   chat_room_group_member
===================================================== */

export const chatRoomGroupMember = pgTable(
  "chat_room_group_member",
  {
    groupRef: uuid("group_ref")
      .notNull()
      .references(() => chatRoomGroup.id, {
        onDelete: "cascade",
      }),
    userRef: uuid("user_ref").notNull(),
    role: groupRole("role").notNull(),
    memberSince: timestamp("member_since", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.groupRef, table.userRef] }),
  })
);

/* =====================================================
   chat_message
===================================================== */

export const chatMessage = pgTable("chat_message", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomRef: uuid("room_ref").notNull(),
  userRef: uuid("user_ref").notNull(),
  message: text("message"),
  sentTime: timestamp("sent_time", { withTimezone: true })
    .notNull()
    .defaultNow(),
  type: chatRoomType("type").notNull(),
});

/* Indexy */
export const chatMessageIndexes = {
  room: (table) => table.roomRef,
  user: (table) => table.userRef,
  type: (table) => table.type,
};
