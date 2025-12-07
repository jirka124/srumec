import { commentService } from "#services/commentService.js";
import { policy as commentPolicy } from "#policies/comment/policy.js";
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

  async getOne(req, res) {
    try {
      const data = req.validated;

      const ev = await commentService.getOne(data);
      if (!ev) {
        throw produceFail(
          "D2sdXWgw3AcgTuiC",
          `comment with given ID { ${data.id} } not found`
        );
      }

      res.json(ev);
    } catch (e) {
      throw produceFail("bQZDS7VrdVUhETa9", e);
    }
  },

  async createOne(req, res) {
    try {
      let data = req.validated;
      data = commentPolicy.validateCreate(req, data);

      const ev = await commentService.createOne(data);
      res.json(ev);
    } catch (e) {
      throw produceFail("cOxyZuGDMDUqgzyD", e);
    }
  },

  async updateOne(req, res) {
    try {
      let data = req.validated;

      const existing = await commentService.getOne({ id: data.id });
      if (!existing) {
        throw produceFail(
          "F3hmSSsCoP4xsOVO",
          `Comment with ID { ${data.id} } not found`
        );
      }

      data = commentPolicy.validateUpdate(req, data, existing);

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
      let data = req.validated;

      const existing = await commentService.getOne({ id: data.id });
      if (!existing) {
        throw produceFail(
          "i2CezSCBpg9PO6F3",
          `comment with given ID { ${data.id} } not found`
        );
      }

      commentPolicy.validateDelete(req, data, existing);

      const count = await commentService.deleteOne({ id: data.id });
      res.json({ count });
    } catch (e) {
      throw produceFail("LgG6bt5I163ufpmi", e);
    }
  },
};
