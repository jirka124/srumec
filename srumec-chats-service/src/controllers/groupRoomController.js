import { service } from "#services/groupRoomService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const controller = {
  async getAllGroupRooms(req, res) {
    try {
      // TODO: REPLACE WITH ID OF LOGGED USER FROM JWT
      const userId = req.query.id;
      if (!userId)
        //
        return res.status(400).json({
          error:
            "TEMP error... Missing ?id query parameter, JWT id will be used",
        });

      const rooms = await service.getAllGroupRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      const err = produceFail("4c0VJLR0rAqYnQKr", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async getOneGroupRoom(req, res) {
    try {
      const data = req.validated;
      const room = await service.getOneGroupRoom(data);

      if (!room) {
        const err = produceFail(
          "moyxlkCSZUmZ6oHc",
          `group room with given ID { ${data.id} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }

      return res.json(room);
    } catch (e) {
      const err = produceFail("ckGAYzNnWCYkhWGV", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async createOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const created = await service.createOneGroupRoom(data);
      return res.json(created);
    } catch (e) {
      const err = produceFail("rBtJzMW6EgdCiyh6", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async updateOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const updated = await service.updateOneGroupRoom(data);
      return res.json(updated);
    } catch (e) {
      const err = produceFail("S6dMzCMOFJ3IiFpx", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async deleteOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteOneGroupRoom(data);
      return res.json({ count });
    } catch (e) {
      const err = produceFail("nRqUUUr431VBaFGq", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },
};
