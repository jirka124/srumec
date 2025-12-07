import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/chat/fieldList.js";

export const policy = {
  validateCreateOne(req, data) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS_GROUP_ROOM.includes(key)) {
          throw produceFail(
            "MzkCp4Xc5xuyvRLv",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateGetOne(req, _, membership) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !membership) {
      throw produceFail(
        "QgPgTrOgIxW8rOC5",
        "You are not a member of this group room."
      );
    }
  },

  validateUpdateOne(req, data, membership) {
    const isAdmin = req.user.role === "admin";

    if (!membership && !isAdmin) {
      throw produceFail(
        "ToHFb5B95jXBjiMh",
        "You cannot modify a group you do not belong to."
      );
    }

    if (!isAdmin && membership.role !== "admin") {
      throw produceFail(
        "TDIbXKi6SnZC8HIF",
        "Only group admins can update group information."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS_GROUP_ROOM.includes(key)) {
          throw produceFail(
            "oB1FkQVefThQfk5g",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateDelete(req, _, membership) {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return true;

    if (!membership || membership.role !== "admin") {
      throw produceFail(
        "oriMk9Sq5w8KxBm7",
        "Only admins can delete group rooms."
      );
    }

    return true;
  },
};
