import { eventService } from "#services/eventService.js";
import { produceFail } from "#lib/fail/fail.js";

export async function handleEventExpired({ id }) {
  try {
    await eventService.deleteEvent({ id });
  } catch (e) {
    throw produceFail("AIhVz4L5GzpbzL4J", e);
  }
}
