import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/chat/fieldList.js";

export const policy = {
  validateCreate(req, data, membership) {
    const isGlobalAdmin = req.user.role === "admin";

    if (!isGlobalAdmin && data.user_ref !== req.user.id) {
      throw produceFail(
        "fPljzlb9N2ePAD8y",
        "User cannot send messages behalf other users."
      );
    }

    if (!membership && !isGlobalAdmin) {
      throw produceFail(
        "y3HHFYazsMVAdg5u",
        "You are not a member of this group."
      );
    }

    if (!isGlobalAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS_GROUP_MESSAGE.includes(key)) {
          throw produceFail(
            "qWoegT03orUEMge6",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateGetAll(req, _, membership) {
    const isGlobalAdmin = req.user.role === "admin";

    if (!membership && !isGlobalAdmin) {
      throw produceFail(
        "RZUUhCwrUp3PBNOu",
        "You are not a member of this group."
      );
    }
  },

  validateGetOne(req, _, membership) {
    return this.validateGetAll(req, _, membership);
  },

  validateUpdate(
    req,
    data,
    { existing: existingMessage, membership: membership }
  ) {
    const isGlobalAdmin = req.user.role === "admin";

    if (!membership && !isGlobalAdmin) {
      throw produceFail(
        "IgO4202UNuPRkoKu",
        "You are not a member of this group."
      );
    }

    if (!isGlobalAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS_GROUP_MESSAGE.includes(key)) {
          throw produceFail(
            "j1YQYhGrBNCtBfWj",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    if (isGlobalAdmin) return data;

    if (existingMessage.user_ref !== req.user.id) {
      throw produceFail(
        "mlvOQbuYa6VTZBRQ",
        "You cannot edit a message you did not write."
      );
    }

    return data;
  },

  validateDelete(req, data, { existing: existingMessage, membership }) {
    const isGlobalAdmin = req.user.role === "admin";

    if (!membership && !isGlobalAdmin) {
      throw produceFail(
        "KvqkdaTfQ9mqnqMe",
        "You are not a member of this group."
      );
    }

    if (isGlobalAdmin || membership.role === "admin") return true;

    if (existingMessage.user_ref !== req.user.id) {
      throw produceFail(
        "vf2qsEbow2u6JORL",
        "You cannot delete a message you did not write."
      );
    }

    return true;
  },
};
