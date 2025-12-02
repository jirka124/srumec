import { redis } from "#lib/redis.js";
import { rabbit } from "#lib/rabbit.js";
import { config } from "#root/config/env.js";
import { logger } from "#lib/log/log.js";

export const expireService = {
  async scheduleExpiration(eventObj) {
    const id = eventObj.id;
    const expireTs = new Date(eventObj.happen_time).getTime();
    const nowTs = Date.now();

    const ttlSeconds = Math.floor((expireTs - nowTs) / 1000);

    if (ttlSeconds <= 0) {
      logger.warn(`Event ${id} already expired – ignoring`);
      return;
    }

    logger.info(
      `Scheduled expiration for event: ${id} (in ${ttlSeconds} seconds)`
    );

    const expKey = `exp:${id}`; // used for TTL
    const dataKey = `exp_data:${id}`; // contains full event object

    // store data WITHOUT TTL
    await redis.set(dataKey, JSON.stringify(eventObj));

    // store exp trigger WITH TTL
    await redis.set(expKey, "", {
      EX: ttlSeconds,
    });
  },

  async handleExpiration(id) {
    const dataKey = `exp_data:${id}`;

    const raw = await redis.get(dataKey);

    if (!raw) {
      logger.warn(`Expired key but no data found: event ${id}`);
      return null;
    }

    const eventObj = JSON.parse(raw);

    // cleanup
    await redis.del(dataKey);

    // publish expiration
    await rabbit.publish(config.expireExchange, "expire.event", {
      type: "expire.event",
      id: eventObj.id,
      happen_time: eventObj.happen_time,
    });

    logger.info(`Expire triggered for event: ${eventObj.id}`);

    return eventObj;
  },
};
