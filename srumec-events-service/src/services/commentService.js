import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";

export const commentService = {
  async getAll(event_ref) {
    logger.info('Executing "getAll" service with params: ', event_ref);

    const rows = await db.execute(sql`
      SELECT 
        id,
        event_ref,
        user_ref,
        reply_to_ref,
        content,
        to_iso (create_time) AS create_time
      FROM event_comments
      WHERE event_ref = ${event_ref}
      ORDER BY create_time ASC;
    `);

    logger.info('Executed "getAll" service with params: ', event_ref);

    return rows;
  },

  async createOne(data) {
    logger.info('Executing "createOne" service with params: ', data);

    const columns = ["event_ref", "user_ref", "reply_to_ref", "content"];
    const values = [
      data.event_ref,
      data.user_ref,
      data.reply_to_ref,
      data.content,
    ];

    if (data.id) {
      columns.unshift("id");
      values.unshift(data.id);
    }

    if (data.create_time !== undefined) {
      columns.push("create_time");
      values.push(data.create_time);
    }

    const columnsSql = sql.raw(columns.map((c) => `"${c}"`).join(", "));
    const valuesSql = sql.join(values, sql`, `);

    const result = await db.execute(sql`
      INSERT INTO event_comments (${columnsSql})
      VALUES (${valuesSql})
      RETURNING
        id,
        event_ref,
        user_ref,
        reply_to_ref,
        content,
        to_iso (create_time) AS create_time;
    `);

    logger.info('Executed "createOne" service with params: ', data);

    return result[0];
  },

  async updateOne(data) {
    logger.info('Executing "updateOne" service with params: ', data);

    const updates = [];

    if (data.content !== undefined) {
      updates.push(sql`content = ${data.content}`);
    }

    if (data.reply_to_ref !== undefined) {
      updates.push(sql`reply_to_ref = ${data.reply_to_ref}`);
    }

    if (data.event_ref !== undefined) {
      updates.push(sql`event_ref = ${data.event_ref}`);
    }

    if (data.user_ref !== undefined) {
      updates.push(sql`user_ref = ${data.user_ref}`);
    }

    if (data.create_time !== undefined) {
      updates.push(sql`create_time = ${data.create_time}`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const result = await db.execute(sql`
      UPDATE event_comments
      SET ${sql.join(updates, sql`, `)}
      WHERE id = ${data.id}
      RETURNING
        id,
        event_ref,
        user_ref,
        reply_to_ref,
        content,
        to_iso (create_time) AS create_time;
    `);

    logger.info('Executed "updateOne" service with params: ', data);

    return result[0] ?? null;
  },

  async deleteOne({ id }) {
    logger.info('Executing "deleteOne" service with params: ', { id });

    const result = await db.execute(sql`
      DELETE FROM event_comments
      WHERE id = ${id}
      RETURNING id;
    `);

    return result.length;
  },
};
