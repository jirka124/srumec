import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geographyPoint } from "./postgis.js";

// EVENTS
export const events = pgTable("events", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  organizerRef: uuid("organizer_ref").notNull(),

  title: varchar("title", { length: 32 }).notNull(),
  description: varchar("description", { length: 512 }),

  location: geographyPoint("location"),

  happenTime: timestamp("happen_time")
    .default(sql`NOW()`)
    .notNull(),
});

// COMMENTS
export const eventComments = pgTable("event_comments", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  eventRef: uuid("event_ref").notNull(),
  userRef: uuid("user_ref").notNull(),

  replyToRef: uuid("reply_to_ref"),

  content: text("content").notNull(),

  createTime: timestamp("create_time")
    .default(sql`NOW()`)
    .notNull(),
});
