import { eventService } from "#services/eventService.js";
import { produceFail } from "#lib/fail/fail.js";

export const eventController = {
  async getNearby(req, res) {
    try {
      const data = req.validated;

      const list = await eventService.getNearbyEvents(data);
      res.json(list);
    } catch (e) {
      throw produceFail("1TgWGUTBV3UTogTc", e);
    }
  },

  async getUserEvents(req, res) {
    try {
      const userId = req.user.id;

      const list = await eventService.getUserEvents({ userId });
      res.json(list);
    } catch (e) {
      throw produceFail("C0LoEpU54HpKrcSk", e);
    }
  },

  async getPending(req, res) {
    try {
      const list = await eventService.getPendingEvents();
      res.json(list);
    } catch (e) {
      throw produceFail("oXC3mOcio5KQMt2M", e);
    }
  },

  async getOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.getEventById(data);
      if (!ev) {
        throw produceFail(
          "iC2V355CDCYFTI9J",
          `event with given ID { ${data.id} } not found`
        );
      }
      res.json(ev);
    } catch (e) {
      throw produceFail("d5xC5Hfd9L4qN5Oc", e);
    }
  },

  async createOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.createEvent(data);
      res.json(ev);
    } catch (e) {
      throw produceFail("T0UXlS6xs2tvp2hJ", e);
    }
  },

  async updateOne(req, res) {
    try {
      const data = req.validated;

      const ev = await eventService.updateEvent(data);
      if (!ev) {
        throw produceFail(
          "8sNY4yBPBmlQdV2n",
          `event with given ID { ${data.id} } not found`
        );
      }
      res.json(ev);
    } catch (e) {
      throw produceFail("pT6xNrqqC6PAV20J", e);
    }
  },

  async deleteOne(req, res) {
    try {
      const data = req.validated;

      const count = await eventService.deleteEvent(data);
      res.json({ count });
    } catch (e) {
      throw produceFail("TwlcQjNvJpEhfnLz", e);
    }
  },
};
