import { logger } from "#lib/log/log.js";
import { wsServer } from "#ws/server.js";

export const eventService = {
  async sendEventCreated({ id, lat, long, organizer_ref, consumers }) {
    logger.info('Executing "sendEventCreated" service with params: ', {
      id,
      lat,
      long,
      organizer_ref,
    });

    wsServer.sendToClientsJSON(consumers, {
      event: "event.created",
      data: { id, lat, long, organizer_ref },
    });

    logger.info('Executed "sendEventCreated" service with params: ', {
      id,
      lat,
      long,
      organizer_ref,
    });

    return consumers;
  },

  async sendEventUpdated({ id, lat, long, organizer_ref, consumers }) {
    logger.info('Executing "sendEventUpdated" service with params: ', {
      id,
      lat,
      long,
      organizer_ref,
    });

    wsServer.sendToClientsJSON(consumers, {
      event: "event.updated",
      data: { id, lat, long, organizer_ref },
    });

    logger.info('Executed "sendEventUpdated" service with params: ', {
      id,
      lat,
      long,
      organizer_ref,
    });

    return consumers;
  },

  async sendEventDeleted({ id, consumers }) {
    logger.info('Executing "sendEventDeleted" service with params: ', { id });

    wsServer.sendToClientsJSON(consumers, {
      event: "event.deleted",
      data: { id },
    });

    logger.info('Executed "sendEventDeleted" service with params: ', { id });

    return consumers;
  },
};
