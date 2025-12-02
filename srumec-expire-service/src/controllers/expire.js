import { expireService } from "#services/expire.js";
import { produceFail } from "#lib/fail/fail.js";

export const expireController = {
  async onEventCreated(msg) {
    if (!msg.event) return;

    try {
      const ev = msg.event;

      if (!ev.happen_time || !ev.id)
        throw produceFail("kpAykR5UXDLMdLFK", "happen_time or id not supplied");

      await expireService.scheduleExpiration(ev);
    } catch (e) {
      throw produceFail("2xy5AcPdGP9XkaiR", e);
    }
  },

  async onKeyExpired(expiredKey) {
    try {
      const id = expiredKey.slice(4);
      return await expireService.handleExpiration(id);
    } catch (e) {
      throw produceFail("wIXsxNfI7sRr8L8M", e);
    }
  },
};
