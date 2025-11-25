import { service } from "#services/groupMessageService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const controller = {
  async getAllGroupMessages(req, res) {
    try {
      const data = req.validated;
      const rows = await service.getAllGroupMessages(data);
      return res.json(rows);
    } catch (e) {
      const err = produceFail("uTngf8rBFMGl2kG9", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async createGroupMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.createGroupMessage(data);
      return res.json(result);
    } catch (e) {
      const err = produceFail("9KcNFh86gHjwlCVn", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async updateGroupMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.updateGroupMessage(data);

      if (!result) {
        const err = produceFail(
          "Jy23koECl49i2xJC",
          `Message with ID ${data.id} not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }

      return res.json(result);
    } catch (e) {
      const err = produceFail("kWo4VQsP8eE2Ju9b", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async deleteGroupMessage(req, res) {
    try {
      const data = req.validated;
      const count = await service.deleteGroupMessage(data);
      return res.json({ count });
    } catch (e) {
      const err = produceFail("sGo1aopwfF46boKb", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },
};
