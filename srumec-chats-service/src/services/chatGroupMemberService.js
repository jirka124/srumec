import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";

export const service = {
  async getAllMembers({ group_ref }) {
    logger.info('Executing "getAllMembers" service with params: ', {
      group_ref,
    });

    const rows = await db.execute(sql`
    SELECT group_ref, user_ref, role, to_iso(member_since) AS member_since
    FROM chat_room_group_member
    WHERE group_ref = ${group_ref};
  `);

    logger.info('Executed "getAllMembers" service with params: ', {
      group_ref,
    });

    return rows;
  },

  async getMember({ group_ref, user_ref }) {
    logger.info('Executing "getMember" service with params:', {
      group_ref,
      user_ref,
    });

    const rows = await db.execute(sql`
    SELECT 
      group_ref,
      user_ref,
      role,
      to_iso(member_since) AS member_since
    FROM chat_room_group_member
    WHERE group_ref = ${group_ref}
      AND user_ref = ${user_ref};
  `);

    logger.info('Executed "getMember" service with params:', {
      group_ref,
      user_ref,
    });

    return rows[0] ?? null;
  },

  async createMember(member) {
    logger.info('Executing "createMember" service with params: ', { member });

    const cols = [];
    const vals = [];

    // required
    cols.push("group_ref");
    vals.push(member.group_ref);

    cols.push("user_ref");
    vals.push(member.user_ref);

    cols.push("role");
    vals.push(member.role);

    // optional
    if (member.member_since !== undefined) {
      cols.push("member_since");
      vals.push(member.member_since);
    }

    const csql = sql.raw(cols.map((c) => `"${c}"`).join(", "));
    const vsql = sql.join(vals, sql`, `);

    const result = await db.execute(sql`
    INSERT INTO chat_room_group_member (${csql})
    VALUES (${vsql})
    RETURNING
      group_ref,
      user_ref,
      role,
      to_iso(member_since) AS member_since;
  `);

    logger.info('Executed "createMember" service with params: ', { member });

    return result[0];
  },

  async updateMember(member) {
    logger.info('Executing "updateMember" service with params: ', { member });

    const updates = [];

    if (member.role !== undefined) {
      updates.push(sql`role = ${member.role}`);
    }

    if (member.member_since !== undefined) {
      updates.push(sql`member_since = ${member.member_since}`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const result = await db.execute(sql`
    UPDATE chat_room_group_member
    SET ${sql.join(updates, sql`, `)}
    WHERE group_ref = ${member.group_ref}
      AND user_ref = ${member.user_ref}
    RETURNING
      group_ref,
      user_ref,
      role,
      to_iso(member_since) AS member_since;
  `);

    logger.info('Executed "updateMember" service with params: ', { member });

    return result[0] ?? null;
  },

  async deleteMember({ group_ref, user_ref }) {
    logger.info('Executing "deleteMember" service with params: ', {
      group_ref,
      user_ref,
    });

    const result = await db.execute(sql`
    DELETE FROM chat_room_group_member
    WHERE group_ref = ${group_ref}
      AND user_ref = ${user_ref}
    RETURNING user_ref;
  `);

    logger.info('Executed"deleteMember" service with params: ', {
      group_ref,
      user_ref,
    });

    return result.length;
  },
};
