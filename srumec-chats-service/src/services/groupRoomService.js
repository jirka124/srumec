import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";
import { service as chatGroupMemberService } from "#services/chatGroupMemberService.js";

export const service = {
  async getAllGroupRooms({ userId }) {
    logger.info('Executing "getAllGroupRooms" service with params: ', {
      userId,
    });

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

    logger.info('Executed "getAllGroupRooms" service with params: ', {
      userId,
    });

    return rows;
  },

  async getOneGroupRoom({ id }) {
    logger.info('Executing "getOneGroupRoom" service with params: ', { id });

    const rows = await db.execute(sql`
    SELECT
      id,
      name,
      to_iso(create_time) AS create_time
    FROM chat_room_group
    WHERE id = ${id};
  `);

    logger.info('Executing "getOneGroupRoom" service with params: ', { id });

    return rows[0] ?? null;
  },

  async createOneGroupRoom(room, adminId) {
    logger.info('Executing "createOneGroupRoom" service with params: ', room);

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

    // automatically create first admin user of group (member creating room)
    await chatGroupMemberService.createMember({
      user_ref: adminId,
      group_ref: result[0].id,
      role: "admin",
    });

    logger.info('Executed "createOneGroupRoom" service with params: ', room);

    return result[0];
  },

  async updateOneGroupRoom(room) {
    logger.info('Executing "updateOneGroupRoom" service with params: ', room);

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

    logger.info('Executed "updateOneGroupRoom" service with params: ', room);

    return result[0] ?? null;
  },

  async deleteOneGroupRoom({ id }) {
    logger.info('Executing "deleteOneGroupRoom" service with params: ', { id });

    const result = await db.execute(sql`
    DELETE FROM chat_room_group
    WHERE id = ${id}
    RETURNING id;
  `);

    logger.info('Executed "deleteOneGroupRoom" service with params: ', { id });

    return result.length;
  },
};
