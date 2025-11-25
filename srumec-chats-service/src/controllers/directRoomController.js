import { service } from "#services/directRoomService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const controller = {
  async getAllDirectRooms(req, res) {
    try {
      // TODO: REPLACE WITH ID OF LOGGED USER FROM JWT
      const userId = req.query.id;
      if (!userId)
        //
        return res.status(400).json({
          error:
            "TEMP error... Missing ?id query parameter, JWT id will be used",
        });

      const rooms = await service.getAllDirectRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      const err = produceFail("TJdMl5QKdmUjneJi", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async getOneDirectRoom(req, res) {
    try {
      const data = req.validated;
      const room = await service.getOneDirectRoom(data);

      if (!room) {
        const err = produceFail(
          "5DkTtaIOyxYvO41n",
          `direct room with given ID { ${data.id} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }

      return res.json(room);
    } catch (e) {
      const err = produceFail("dPzicAmhxPQV3TiR", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async createOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const created = await service.createOneDirectRoom(data);
      return res.json(created);
    } catch (e) {
      const err = produceFail("bxJIfB6nxlSOzTGk", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async updateOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const updated = await service.updateOneDirectRoom(data);
      return res.json(updated);
    } catch (e) {
      const err = produceFail("MGhHfSA5nuALyYuy", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async deleteOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteOneDirectRoom(data);
      return res.json({ count });
    } catch (e) {
      const err = produceFail("8m4JFoHIruZf8iHc", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },
};
