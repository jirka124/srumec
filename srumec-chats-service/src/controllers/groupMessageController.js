import { service } from "#services/groupMessageService.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllGroupMessages(req, res) {
    try {
      const data = req.validated;
      const rows = await service.getAllGroupMessages(data);
      return res.json(rows);
    } catch (e) {
      throw produceFail("uTngf8rBFMGl2kG9", e);
    }
  },

  async getOneGroupMessage(req, res) {
    try {
      const data = req.validated;
      const msg = await service.getOneGroupMessage(data);

      if (!msg) {
        throw produceFail(
          "m6KVhxq9qrYalkxm",
          `Group message (${data.id}) not found in room ${data.room_ref}`
        );
      }

      return res.json(msg);
    } catch (e) {
      throw produceFail("Ve9gvXGIfyZ7OWwp", e);
    }
  },

  async createGroupMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.createGroupMessage(data);
      return res.json(result);
    } catch (e) {
      throw produceFail("9KcNFh86gHjwlCVn", e);
    }
  },

  async updateGroupMessage(req, res) {
    try {
      const data = req.validated;
      const result = await service.updateGroupMessage(data);

      if (!result) {
        throw produceFail(
          "Jy23koECl49i2xJC",
          `Message with ID ${data.id} not found`
        );
      }

      return res.json(result);
    } catch (e) {
      throw produceFail("kWo4VQsP8eE2Ju9b", e);
    }
  },

  async deleteGroupMessage(req, res) {
    try {
      const data = req.validated;
      const count = await service.deleteGroupMessage(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("sGo1aopwfF46boKb", e);
    }
  },
};
