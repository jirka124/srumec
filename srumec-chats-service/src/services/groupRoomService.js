import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";

export const service = {
  async getAllGroupRooms({ userId }) {
    const rows = await db.execute(sql`
    SELECT
      g.id,
      g.name,
      to_iso(g.create_time) AS create_time
    FROM chat_room_group AS g
    JOIN chat_room_group_member AS m
      ON g.id = m.group_ref
    WHERE m.user_ref = ${userId};
  `);

    return rows;
  },

  async getOneGroupRoom({ id }) {
    const rows = await db.execute(sql`
    SELECT
      id,
      name,
      to_iso(create_time) AS create_time
    FROM chat_room_group
    WHERE id = ${id};
  `);

    return rows[0] ?? null;
  },

  async createOneGroupRoom(room) {
    const cols = [];
    const vals = [];

    cols.push("name");
    vals.push(room.name);

    if (room.id !== undefined) {
      cols.push("id");
      vals.push(room.id);
    }

    if (room.create_time !== undefined) {
      cols.push("create_time");
      vals.push(room.create_time);
    }

    const csql = sql.raw(cols.map((c) => `"${c}"`).join(", "));
    const vsql = sql.join(vals, sql`, `);

    const result = await db.execute(sql`
    INSERT INTO chat_room_group (${csql})
    VALUES (${vsql})
    RETURNING
      id,
      name,
      to_iso(create_time) AS create_time;
  `);

    return result[0];
  },

  async updateOneGroupRoom(room) {
    const updates = [];

    if (room.name !== undefined) {
      updates.push(sql`name = ${room.name}`);
    }

    if (room.create_time !== undefined) {
      updates.push(sql`create_time = ${room.create_time}`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const result = await db.execute(sql`
    UPDATE chat_room_group
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${room.id}
    RETURNING
      id,
      name,
      to_iso(create_time) AS create_time;
  `);

    return result[0] ?? null;
  },

  async deleteOneGroupRoom({ id }) {
    const result = await db.execute(sql`
    DELETE FROM chat_room_group
    WHERE id = ${id}
    RETURNING id;
  `);

    return result.length;
  },
};
