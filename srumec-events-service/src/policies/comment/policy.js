import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/comment/fieldList.js";

export const policy = {
  validateCreate(req, data, event) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && data.user_ref !== req.user.id) {
      throw produceFail(
        "eat8rREklgttGCQ7",
        "Only admin can create an comment for another user."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS.includes(key)) {
          throw produceFail(
            "RjuWiE3soHyRYi5m",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    const user_name = isAdmin ? null : req.user.name;

    return { ...data, user_name };
  },

  // ------------------- UPDATE -------------------
  validateUpdate(req, data, existingComment) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && existingComment.user_ref !== req.user.id) {
      throw produceFail(
        "NJKiZkKzMvFtHJGv",
        "You cannot edit a comment that is not yours."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS.includes(key)) {
          throw produceFail(
            "8iZ0tCyXlIiuu02O",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateDelete(req, _, comment) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && comment.user_ref !== req.user.id) {
      throw produceFail(
        "8QRfcIGlSh1wpuZz",
        "You cannot delete a comment that is not yours."
      );
    }
  },
};
