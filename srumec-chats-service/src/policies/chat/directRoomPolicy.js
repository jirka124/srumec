import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/chat/fieldList.js";

export const policy = {
  validateGetOne(req, room) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      if (room.user_1_ref !== userId && room.user_2_ref !== userId) {
        throw produceFail(
          "jTxAqhsXGaeBjIQV",
          "You do not have access to this direct room."
        );
      }
    }
  },

  validateCreate(req, data) {
    const userId = req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      if (
        data.user_1_ref !== userId &&
        data.user_2_ref !== userId &&
        data.user_1_ref !== data.user_2_ref
      ) {
        throw produceFail(
          "pjFw66uuHZ6ABSk7",
          "User cannot create a direct room they are not part of. And cannot create room with itself."
        );
      }
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS_DIRECT_ROOM.includes(key)) {
          throw produceFail(
            "sB9B04L1kY1zy5YS",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateUpdate(req, data, existing) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      throw produceFail(
        "fshQRO7w97mcydXd",
        "Only admins can update direct rooms."
      );
    }

    return data;
  },

  validateDelete(req, data, existing) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      if (existing.user_1_ref !== userId && existing.user_2_ref !== userId) {
        throw produceFail(
          "fF3oSrjhLkv6cSOK",
          "You cannot delete a direct room you are not part of."
        );
      }
    }

    return data;
  },
};
