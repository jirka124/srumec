import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";
import { publishChatMessageCreated } from "#messaging/publisher.js";

export const service = {
  async getAllGroupMessages({ room_ref }) {
    logger.info('Executing "getAllGroupMessages" service with params: ', {
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
    WHERE room_ref = ${room_ref} AND type = 'group';
  `);

    logger.info('Executed "getAllGroupMessages" service with params: ', {
      room_ref,
    });

    return rows;
  },

  async getOneGroupMessage({ id }) {
    logger.info('Executing "getOneGroupMessage" service with params:', {
      id,
    });

    const rows = await db.execute(sql`
    SELECT
      id,
      room_ref,
      user_ref,
      message,
      to_iso(sent_time) AS sent_time
    FROM chat_message
    WHERE id = ${id}
      AND type = 'group';
  `);

    logger.info('Executed "getOneGroupMessage" service with params:', {
      id,
    });

    return rows[0] ?? null;
  },

  async createGroupMessage(msg) {
    logger.info('Executing "createGroupMessage" service with params: ', msg);

    const columns = [];
    const values = [];

    // REQUIRED
    columns.push("room_ref");
    values.push(msg.room_ref);

    columns.push("user_ref");
    values.push(msg.user_ref);

    columns.push("message");
    values.push(msg.message);

    columns.push("type");
    values.push("group");

    // OPTIONAL
    if (msg.id !== undefined) {
      columns.push("id");
      values.push(msg.id);
    }

    if (msg.sent_time !== undefined) {
      columns.push("sent_time");
      values.push(msg.sent_time);
    }

    const result = await db.execute(sql`
    INSERT INTO chat_message (${sql.raw(
      columns.map((c) => `"${c}"`).join(", ")
    )})
    VALUES (${sql.join(values, sql`, `)})
    RETURNING
      id,
      room_ref,
      user_ref,
      message,
      to_iso(sent_time) AS sent_time;
  `);

    publishChatMessageCreated({ ...result[0], type: "group" });

    logger.info('Executed "createGroupMessage" service with params: ', msg);

    return result[0];
  },

  async updateGroupMessage(msg) {
    logger.info('Executing "updateGroupMessage" service with params: ', msg);

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

    const result = await db.execute(sql`
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

    logger.info('Executed "updateGroupMessage" service with params: ', msg);

    return result[0] ?? null;
  },

  async deleteGroupMessage({ id }) {
    logger.info('Executing "deleteGroupMessage" service with params: ', { id });

    const result = await db.execute(sql`
    DELETE FROM chat_message
    WHERE id = ${id}
    RETURNING id;
  `);

    logger.info('Executed "deleteGroupMessage" service with params: ', { id });

    return result.length;
  },
};
