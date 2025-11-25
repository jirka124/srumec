import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";

export const service = {
  async getAllDirectRooms({ userId }) {
    const rows = await db.execute(sql`
    SELECT
      id,
      user_1_ref,
      user_2_ref,
      to_iso(create_time) AS create_time
    FROM chat_room_direct
    WHERE user_1_ref = ${userId}
       OR user_2_ref = ${userId};
  `);

    return rows;
  },

  async getOneDirectRoom({ id }) {
    const rows = await db.execute(sql`
    SELECT
      id,
      user_1_ref,
      user_2_ref,
      to_iso(create_time) AS create_time
    FROM chat_room_direct
    WHERE id = ${id};
  `);

    return rows[0] ?? null;
  },

  async createOneDirectRoom(room) {
    const columns = [];
    const values = [];

    // required
    columns.push("user_1_ref");
    values.push(room.user_1_ref);

    columns.push("user_2_ref");
    values.push(room.user_2_ref);

    // optional
    if (room.id !== undefined) {
      columns.push("id");
      values.push(room.id);
    }

    if (room.create_time !== undefined) {
      columns.push("create_time");
      values.push(room.create_time);
    }

    const csql = sql.raw(columns.map((c) => `"${c}"`).join(", "));
    const vsql = sql.join(values, sql`, `);

    const result = await db.execute(sql`
    INSERT INTO chat_room_direct (${csql})
    VALUES (${vsql})
    RETURNING
      id,
      user_1_ref,
      user_2_ref,
      to_iso(create_time) AS create_time;
  `);

    return result[0];
  },

  async updateOneDirectRoom(room) {
    const updates = [];

    if (room.user_1_ref !== undefined) {
      updates.push(sql`user_1_ref = ${room.user_1_ref}`);
    }

    if (room.user_2_ref !== undefined) {
      updates.push(sql`user_2_ref = ${room.user_2_ref}`);
    }

    if (room.create_time !== undefined) {
      updates.push(sql`create_time = ${room.create_time}`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const rows = await db.execute(sql`
    UPDATE chat_room_direct
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${room.id}
    RETURNING
      id,
      user_1_ref,
      user_2_ref,
      to_iso(create_time) AS create_time;
  `);

    return rows[0] ?? null;
  },

  async deleteOneDirectRoom({ id }) {
    const rows = await db.execute(sql`
    DELETE FROM chat_room_direct
    WHERE id = ${id}
    RETURNING id;
  `);

    return rows.length;
  },
};
