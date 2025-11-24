import { commentService } from "#services/commentService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const commentController = {
  async getAll(req, res) {
    try {
      const { event_ref } = req.validated;

      const ev = await commentService.getAll(event_ref);
      res.json(ev);
    } catch (e) {
      const err = produceFail("uzgMMFIN6JCaB7ER", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async createOne(req, res) {
    try {
      const data = req.validated;

      const ev = await commentService.createOne(data);
      res.json(ev);
    } catch (e) {
      const err = produceFail("cOxyZuGDMDUqgzyD", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async updateOne(req, res) {
    try {
      const data = req.validated;

      const ev = await commentService.updateOne(data);
      if (!ev) {
        const err = produceFail(
          "gFVBfVaogwjLe1CK",
          `comment with given ID { ${data.id} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }
      res.json(ev);
    } catch (e) {
      const err = produceFail("ZZu4ghBUlxie7YA5", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },

  async deleteOne(req, res) {
    try {
      const data = req.validated;

      const count = await commentService.deleteOne(data);
      res.json({ count });
    } catch (e) {
      const err = produceFail("LgG6bt5I163ufpmi", e);
      logger.error(err.serverPrepare());
      res.status(500).json(err.clientPrepare());
    }
  },
};
