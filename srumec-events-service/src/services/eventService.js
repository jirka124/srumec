import { db } from "#root/config/db.js";
import { sql } from "drizzle-orm";
import { logger } from "#lib/log/log.js";
import {
  publishEventCreated,
  publishEventUpdated,
  publishEventDeleted,
} from "#messaging/publisher.js";
import {} from "#messaging/publisher.js";

export const eventService = {
  async getNearbyEvents({ latitude, longitude, radius_m }) {
    logger.info('Executing "getNearbyEvents" service with params: ', {
      latitude,
      longitude,
      radius_m,
    });

    const rows = await db.execute(sql`
    SELECT
      id,
      organizer_ref,
      title,
      description,
      to_iso(happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status
    FROM events
    WHERE status = 'approved'
      AND ST_DWithin(
        location,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${radius_m}
      );
  `);

    logger.info('Executed "getNearbyEvents" service with params: ', {
      latitude,
      longitude,
      radius_m,
    });

    return rows;
  },

  async getUserEvents({ userId }) {
    logger.info('Executing "getUserEvents" service with params: ', { userId });

    const rows = await db.execute(sql`
    SELECT
      id,
      organizer_ref,
      title,
      description,
      to_iso(happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status
    FROM events
    WHERE organizer_ref = ${userId}
    ORDER BY happen_time ASC;
  `);

    logger.info('Executed "getUserEvents" service with params: ', { userId });

    return rows;
  },

  async getPendingEvents() {
    logger.info('Executing "getPendingEvents" service with params: ', {});

    const rows = await db.execute(sql`
    SELECT
      id,
      organizer_ref,
      title,
      description,
      to_iso(happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status
    FROM events
    WHERE status = 'pending'
    ORDER BY happen_time ASC;
  `);

    logger.info('Executed "getPendingEvents" service with params: ', {});

    return rows;
  },

  async getEventById({ id }) {
    logger.info('Executing "getEventById" service with params: ', {
      id,
    });

    const rows = await db.execute(sql`
    SELECT
      id,
      organizer_ref,
      title,
      description,
      to_iso (happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status
    FROM events
    WHERE id = ${id};
  `);

    logger.info('Executed "getEventById" service with params: ', {
      id,
    });

    return rows[0] || null;
  },

  async createEvent(data) {
    logger.info('Executing "createEvent" service with params: ', data);

    const columns = ["organizer_ref", "title"];
    const values = [data.organizer_ref, data.title];

    if (data.id !== undefined) {
      columns.unshift("id");
      values.unshift(data.id);
    }

    if (data.description !== undefined) {
      columns.push("description");
      values.push(data.description);
    }

    if (data.happen_time !== undefined) {
      columns.push("happen_time");
      values.push(data.happen_time);
    }

    if (data.latitude !== undefined && data.longitude !== undefined) {
      columns.push("location");
      values.push(sql`
      ST_SetSRID(
        ST_MakePoint(${data.longitude}, ${data.latitude}),
        4326
      )::geography
    `);
    }

    if (data.status !== undefined) {
      columns.push("status");
      values.push(data.status);
    }

    const columnsSql = sql.raw(columns.map((c) => `"${c}"`).join(", "));
    const valuesSql = sql.join(values, sql`, `);

    const result = await db.execute(sql`
    INSERT INTO events (${columnsSql})
    VALUES (${valuesSql})
    RETURNING
      id,
      organizer_ref,
      title,
      description,
      to_iso (happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status;
  `);

    await publishEventCreated(result[0]);

    logger.info('Executed "createEvent" service with params: ', data);

    return result[0];
  },

  async updateEvent(data) {
    logger.info('Executing "updateEvent" service with params: ', data);

    const updates = [];
    let shouldResetStatus = false;

    if (data.title !== undefined) {
      updates.push(sql`title = ${data.title}`);
      shouldResetStatus = true;
    }

    if (data.description !== undefined) {
      updates.push(sql`description = ${data.description}`);
      shouldResetStatus = true;
    }

    if (data.happen_time !== undefined) {
      updates.push(sql`happen_time = ${data.happen_time}`);
    }

    if (data.latitude !== undefined && data.longitude !== undefined) {
      updates.push(sql`
      location = ST_SetSRID(
        ST_MakePoint(${data.longitude}, ${data.latitude}),
        4326
      )::geography
    `);
    }

    if (data.status !== undefined) {
      updates.push(sql`status = ${data.status}`);
    } else if (shouldResetStatus) {
      updates.push(sql`status = 'pending'`);
    }

    if (updates.length === 0) {
      throw new Error("Nothing to update.");
    }

    const result = await db.execute(sql`
    UPDATE events
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${data.id}
    RETURNING
      id,
      organizer_ref,
      title,
      description,
      to_iso (happen_time) AS happen_time,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      status;
  `);

    const event = result[0] ?? null;
    if (event !== null) await publishEventUpdated(event);

    logger.info('Executed "updateEvent" service with params: ', data);

    return event;
  },

  async deleteEvent({ id }) {
    logger.info('Executing "deleteEvent" service with params: ', { id });

    const result = await db.execute(sql`
    DELETE FROM events
    WHERE id = ${id}
    RETURNING id;
  `);

    if (result.length) await publishEventDeleted(id);

    logger.info('Executed "deleteEvent" service with params: ', { id });

    return result.length;
  },
};
