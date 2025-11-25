import { service } from "#services/directMessageService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const controller = {
  async getAllDirectMessages(req, res) {
    try {
      const data = req.validated;
      const rows = await service.getAllDirectMessages(data);
      return res.json(rows);
    } catch (e) {
      const err = produceFail("Ya6Z2FzCIA3NvxGL", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async createDirectMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.createDirectMessage(data);
      return res.json(result);
    } catch (e) {
      const err = produceFail("RNKOK3u0ZmKxCgeu", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async updateDirectMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.updateDirectMessage(data);

      if (!result) {
        const err = produceFail(
          "PMD7ZyzK2fQm6sqQ",
          `Message with ID ${data.id} not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }

      return res.json(result);
    } catch (e) {
      const err = produceFail("AC5GC5tGJWjanhGH", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async deleteDirectMessage(req, res) {
    try {
      const data = req.validated;
      const count = await service.deleteDirectMessage(data);
      return res.json({ count });
    } catch (e) {
      const err = produceFail("KTaKlBo3mVinXUXn", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },
};
