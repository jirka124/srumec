import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";

export const service = {
  async getAllDirectMessages({ room_ref }) {
    logger.info('Executing "getAllDirectMessages" service with params: ', {
      room_ref,
    });

    const rows = await db.execute(sql`
    SELECT
      id,
      room_ref,
      user_ref,
      message,
      to_iso(sent_time) AS sent_time
    FROM chat_message
    WHERE room_ref = ${room_ref} AND type = 'direct';
  `);

    logger.info('Executed "getAllDirectMessages" service with params: ', {
      room_ref,
    });

    return rows;
  },

  async createDirectMessage(msg) {
    logger.info('Executing "createDirectMessage" service with params: ', msg);

    const cols = [];
    const vals = [];

    // required
    cols.push("room_ref");
    vals.push(msg.room_ref);

    cols.push("user_ref");
    vals.push(msg.user_ref);

    cols.push("message");
    vals.push(msg.message);

    cols.push("type");
    vals.push("direct");

    // optional
    if (msg.id !== undefined) {
      cols.push("id");
      vals.push(msg.id);
    }

    if (msg.sent_time !== undefined) {
      cols.push("sent_time");
      vals.push(msg.sent_time);
    }

    const csql = sql.raw(cols.map((c) => `"${c}"`).join(", "));
    const vsql = sql.join(vals, sql`, `);

    const result = await db.execute(sql`
    INSERT INTO chat_message (${csql})
    VALUES (${vsql})
    RETURNING
      id,
      room_ref,
      user_ref,
      message,
      to_iso(sent_time) AS sent_time;
  `);

    logger.info('Executed "createDirectMessage" service with params: ', msg);

    return result[0];
  },

  async updateDirectMessage(msg) {
    logger.info('Executing "updateDirectMessage" service with params: ', msg);

    const updates = [];

    if (msg.room_ref !== undefined) {
      updates.push(sql`room_ref = ${msg.room_ref}`);
    }

    if (msg.user_ref !== undefined) {
      updates.push(sql`user_ref = ${msg.user_ref}`);
    }

    if (msg.message !== undefined) {
      updates.push(sql`message = ${msg.message}`);
    }

    if (msg.sent_time !== undefined) {
      updates.push(sql`sent_time = ${msg.sent_time}`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const rows = await db.execute(sql`
    UPDATE chat_message
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${msg.id}
    RETURNING
      id,
      room_ref,
      user_ref,
      message,
      to_iso(sent_time) AS sent_time;
  `);

    logger.info('Executed "updateDirectMessage" service with params: ', msg);

    return rows[0] ?? null;
  },

  async deleteDirectMessage({ id }) {
    logger.info('Executing "deleteDirectMessage" service with params: ', {
      id,
    });

    const rows = await db.execute(sql`
    DELETE FROM chat_message
    WHERE id = ${id}
    RETURNING id;
  `);

    logger.info('Executed "deleteDirectMessage" service with params: ', { id });

    return rows.length;
  },
};
