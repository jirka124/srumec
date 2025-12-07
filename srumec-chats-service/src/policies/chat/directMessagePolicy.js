import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/chat/fieldList.js";

export const policy = {
  validateCreate(req, data, directRoom) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && data.user_ref !== req.user.id) {
      throw produceFail(
        "j8EfOSXfaXHDynLJ",
        "User cannot send messages behalf other users."
      );
    }

    if (!isAdmin) {
      if (
        directRoom.user_1_ref !== userId &&
        directRoom.user_2_ref !== userId
      ) {
        throw produceFail(
          "OrpBge3XS7DQMMgM",
          "You cannot send messages to a direct room you do not participate in."
        );
      }
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS_DIRECT_MESSAGE.includes(key)) {
          throw produceFail(
            "QsmuAMuVC5nfkbta",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  // ------------------- READ -------------------
  validateGetAll(req, directRoom) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      if (
        directRoom.user_1_ref !== userId &&
        directRoom.user_2_ref !== userId
      ) {
        throw produceFail(
          "D3j1yilcfEp6AZm3",
          "You cannot read messages in a room you do not participate in."
        );
      }
    }
  },

  validateGetOne(req, directRoom) {
    return this.validateGetAll(req, directRoom);
  },

  // ------------------- UPDATE -------------------
  validateUpdate(req, data, { existing: message, room: directRoom }) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // Only author or admin can update
    if (!isAdmin && message.user_ref !== userId) {
      throw produceFail(
        "Atl3znHWpvR8qHve",
        "You cannot edit a message you did not write."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS_DIRECT_MESSAGE.includes(key)) {
          throw produceFail(
            "8hctBjphsTJtbCdq",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  // ------------------- DELETE -------------------
  validateDelete(req, message, directRoom) {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // Only author or admin can delete
    if (!isAdmin && message.user_ref !== userId) {
      throw produceFail(
        "BgblPyoHXO4QjPfh",
        "You cannot delete a message you did not write."
      );
    }

    return true;
  },
};
