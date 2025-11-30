import { service } from "#services/chatGroupMemberService.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllMembers(req, res) {
    try {
      const data = req.validated;

      const ev = await service.getAllMembers(data);
      return res.json(ev);
    } catch (e) {
      throw produceFail("TIjIYLfwEDZ62Akf", e);
    }
  },

  async createMember(req, res) {
    try {
      const data = req.validated;

      const ev = await service.createMember(data);
      return res.json(ev);
    } catch (e) {
      throw produceFail("1FIhyHBTUlLcL7js", e);
    }
  },

  async updateMember(req, res) {
    try {
      const data = req.validated;

      const ev = await service.updateMember(data);
      if (!ev) {
        throw produceFail(
          "yyIABXBK85axWgp5",
          `room member with given IDs { group_ref: ${data.group_ref}, user_ref: ${data.user_ref} } not found`
        );
      }

      return res.json(ev);
    } catch (e) {
      throw produceFail("0Xv61NTDGpKAEt1c", e);
    }
  },

  async deleteMember(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteMember(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("r8KwwKq0XZbKAp5s", e);
    }
  },
};
