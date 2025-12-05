import { service } from "#services/directMessageService.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllDirectMessages(req, res) {
    try {
      const data = req.validated;
      const rows = await service.getAllDirectMessages(data);
      return res.json(rows);
    } catch (e) {
      throw produceFail("Ya6Z2FzCIA3NvxGL", e);
    }
  },

  async getOneDirectMessage(req, res) {
    try {
      const data = req.validated;
      const msg = await service.getOneDirectMessage(data);

      if (!msg) {
        throw produceFail(
          "egqRzJ5kYDGZS2ts",
          `Direct message (${data.id}) not found in room ${data.room_ref}`
        );
      }

      return res.json(msg);
    } catch (e) {
      throw produceFail("q9cRBoh8ERQnU5yl", e);
    }
  },

  async createDirectMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.createDirectMessage(data);
      return res.json(result);
    } catch (e) {
      throw produceFail("RNKOK3u0ZmKxCgeu", e);
    }
  },

  async updateDirectMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.updateDirectMessage(data);

      if (!result) {
        throw produceFail(
          "PMD7ZyzK2fQm6sqQ",
          `Message with ID ${data.id} not found`
        );
      }

      return res.json(result);
    } catch (e) {
      throw produceFail("AC5GC5tGJWjanhGH", e);
    }
  },

  async deleteDirectMessage(req, res) {
    try {
      const data = req.validated;
      const count = await service.deleteDirectMessage(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("KTaKlBo3mVinXUXn", e);
    }
  },
};
