import { service } from "#services/chatGroupMemberService.js";
import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export const controller = {
  async getAllMembers(req, res) {
    try {
      const data = req.validated;

      const ev = await service.getAllMembers(data);
      return res.json(ev);
    } catch (e) {
      const err = produceFail("TIjIYLfwEDZ62Akf", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async createMember(req, res) {
    try {
      const data = req.validated;

      const ev = await service.createMember(data);
      return res.json(ev);
    } catch (e) {
      const err = produceFail("1FIhyHBTUlLcL7js", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async updateMember(req, res) {
    try {
      const data = req.validated;

      const ev = await service.updateMember(data);
      if (!ev) {
        const err = produceFail(
          "yyIABXBK85axWgp5",
          `room member with given IDs { group_ref: ${data.group_ref}, user_ref: ${data.user_ref} } not found`
        );
        logger.info(err.serverPrepare());
        return res.status(404).json(err.clientPrepare());
      }

      return res.json(ev);
    } catch (e) {
      const err = produceFail("0Xv61NTDGpKAEt1c", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },

  async deleteMember(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteMember(data);
      return res.json({ count });
    } catch (e) {
      const err = produceFail("r8KwwKq0XZbKAp5s", e);
      logger.error(err.serverPrepare());
      return res.status(500).json(err.clientPrepare());
    }
  },
};
