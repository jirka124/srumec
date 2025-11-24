import { eventService } from "#services/eventService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const eventController = {
  async getNearby(req, res) {
    try {
      const data = req.validated;

      const list = await eventService.getNearbyEvents(data);
      res.json(list);
    } catch (e) {
      const err = produceFail("1TgWGUTBV3UTogTc", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async getOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.getEventById(data);
      if (!ev) {
        const err = produceFail(
          "iC2V355CDCYFTI9J",
          `event with given ID { ${data.id} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }
      res.json(ev);
    } catch (e) {
      const err = produceFail("d5xC5Hfd9L4qN5Oc", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async createOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.createEvent(data);
      res.json(ev);
    } catch (e) {
      const err = produceFail("T0UXlS6xs2tvp2hJ", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async updateOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.updateEvent(data);
      if (!ev) {
        const err = produceFail(
          "8sNY4yBPBmlQdV2n",
          `event with given ID { ${data.id} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }
      res.json(ev);
    } catch (e) {
      const err = produceFail("pT6xNrqqC6PAV20J", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async deleteOne(req, res) {
    try {
      const data = req.validated;

      const count = await eventService.deleteEvent(data);
      res.json({ count });
    } catch (e) {
      const err = produceFail("TwlcQjNvJpEhfnLz", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },
};
