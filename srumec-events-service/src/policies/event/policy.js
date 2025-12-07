import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/event/fieldList.js";

export const policy = {
  validateGetPending(req, data, extra) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin)
      throw produceFail("vPCfnXmsiwLlZ5PI", "User cannot view pending events.");
  },

  validateCreate(req, data, extra) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && data.organizer_ref !== req.user.id) {
      throw produceFail(
        "2hzcG8oklWB568Ub",
        "Only admin can create an event for another user."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS.includes(key)) {
          throw produceFail(
            "fUJ6nWaUeOVZCW5F",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateUpdate(req, data, event) {
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && event.organizer_ref !== req.user.id) {
      throw produceFail(
        "MmsjudGgcjhKPL3k",
        "User cannot update event not owned by him."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS.includes(key)) {
          throw produceFail(
            "gHPKiJPG30SkBEr9",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return data;
  },

  validateDelete(req, _, event) {
    const isAdmin = req.user.role === "admin";
    if (isAdmin) return event;

    if (event.organizer_ref !== req.user.id) {
      throw produceFail(
        "gvSh2EPNekZNX8R4",
        "User cannot delete an event not owned by him."
      );
    }
  },
};
