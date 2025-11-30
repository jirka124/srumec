import { commentService } from "#services/commentService.js";
import { produceFail } from "#lib/fail/fail.js";

export const commentController = {
  async getAll(req, res) {
    try {
      const { event_ref } = req.validated;

      const ev = await commentService.getAll(event_ref);
      res.json(ev);
    } catch (e) {
      throw produceFail("uzgMMFIN6JCaB7ER", e);
    }
  },

  async createOne(req, res) {
    try {
      const data = req.validated;

      const ev = await commentService.createOne(data);
      res.json(ev);
    } catch (e) {
      throw produceFail("cOxyZuGDMDUqgzyD", e);
    }
  },

  async updateOne(req, res) {
    try {
      const data = req.validated;

      const ev = await commentService.updateOne(data);
      if (!ev) {
        throw produceFail(
          "gFVBfVaogwjLe1CK",
          `comment with given ID { ${data.id} } not found`
        );
      }
      res.json(ev);
    } catch (e) {
      throw produceFail("ZZu4ghBUlxie7YA5", e);
    }
  },

  async deleteOne(req, res) {
    try {
      const data = req.validated;

      const count = await commentService.deleteOne(data);
      res.json({ count });
    } catch (e) {
      throw produceFail("LgG6bt5I163ufpmi", e);
    }
  },
};
