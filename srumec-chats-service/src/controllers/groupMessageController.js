import { service as groupMessageService } from "#services/groupMessageService.js";
import { service as groupMemberService } from "#services/chatGroupMemberService.js";
import { policy as groupMessagePolicy } from "#policies/chat/groupMessagePolicy.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllGroupMessages(req, res) {
    try {
      const data = req.validated;

      const membership = await groupMemberService.getMember({
        group_ref: data.room_ref,
        user_ref: req.user.id,
      });

      groupMessagePolicy.validateGetAll(req, data, membership);

      const rows = await groupMessageService.getAllGroupMessages(data);
      return res.json(rows);
    } catch (e) {
      throw produceFail("uTngf8rBFMGl2kG9", e);
    }
  },

  async getOneGroupMessage(req, res) {
    try {
      const data = req.validated;
      const msg = await groupMessageService.getOneGroupMessage(data);

      if (!msg) {
        throw produceFail(
          "m6KVhxq9qrYalkxm",
          `Group message (${data.id}) not found`
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: msg.room_ref,
        user_ref: req.user.id,
      });

      groupMessagePolicy.validateGetOne(req, data, membership);

      return res.json(msg);
    } catch (e) {
      throw produceFail("Ve9gvXGIfyZ7OWwp", e);
    }
  },

  async createGroupMessage(req, res) {
    try {
      let data = req.validated;

      const membership = await groupMemberService.getMember({
        group_ref: data.room_ref,
        user_ref: req.user.id,
      });

      data = groupMessagePolicy.validateCreate(req, data, membership);

      const result = await groupMessageService.createGroupMessage(data);
      return res.json(result);
    } catch (e) {
      throw produceFail("9KcNFh86gHjwlCVn", e);
    }
  },

  async updateGroupMessage(req, res) {
    try {
      let data = req.validated;

      const existing = await groupMessageService.getOneGroupMessage({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "zdSE7hudqYfAS0pV",
          `Group message with ID ${data.id} not found`
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: existing.room_ref,
        user_ref: req.user.id,
      });

      data = groupMessagePolicy.validateUpdate(req, data, {
        existing,
        membership,
      });

      const result = await groupMessageService.updateGroupMessage(data);

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

      const existing = await groupMessageService.getOneGroupMessage({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "Op6MLAVOGSmEIHjT",
          `Group message with ID ${data.id} not found`,
          404
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: existing.room_ref,
        user_ref: req.user.id,
      });

      groupMessagePolicy.validateDelete(req, data, { existing, membership });

      const count = await groupMessageService.deleteGroupMessage(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("sGo1aopwfF46boKb", e);
    }
  },
};
