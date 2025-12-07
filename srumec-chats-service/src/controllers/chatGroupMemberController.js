import { service as groupMemberService } from "#services/chatGroupMemberService.js";
import { policy as groupMemberPolicy } from "#policies/chat/groupMemberPolicy.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllMembers(req, res) {
    try {
      const data = req.validated;

      const actorMembership = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: req.user.id,
      });

      groupMemberPolicy.validateGetAll(req, data, actorMembership);

      const ev = await groupMemberService.getAllMembers(data);
      return res.json(ev);
    } catch (e) {
      throw produceFail("TIjIYLfwEDZ62Akf", e);
    }
  },

  async createMember(req, res) {
    try {
      const data = req.validated;

      const actorMembership = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: req.user.id,
      });

      groupMemberPolicy.validateCreate(req, data, actorMembership);

      const ev = await groupMemberService.createMember(data);
      return res.json(ev);
    } catch (e) {
      throw produceFail("1FIhyHBTUlLcL7js", e);
    }
  },

  async updateMember(req, res) {
    try {
      const data = req.validated;

      const actorMembership = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: req.user.id,
      });

      const targetMember = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: data.user_ref,
      });

      if (!targetMember) {
        throw produceFail(
          "1THgDr0JauTDZpPW",
          `Member ${data.user_ref} not found in group ${data.group_ref}`
        );
      }

      groupMemberPolicy.validateUpdate(req, data, {
        actorMembership,
        targetMember,
      });

      const ev = await groupMemberService.updateMember(data);
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

      const actorMembership = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: req.user.id,
      });

      const targetMember = await groupMemberService.getMember({
        group_ref: data.group_ref,
        user_ref: data.user_ref,
      });

      if (!targetMember) {
        throw produceFail(
          "aaOlHQ63D5lhanen",
          `Member ${data.user_ref} not found in group ${data.group_ref}`
        );
      }

      groupMemberPolicy.validateDelete(req, data, {
        actorMembership,
        targetMember,
      });

      const count = await groupMemberService.deleteMember(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("r8KwwKq0XZbKAp5s", e);
    }
  },
};
