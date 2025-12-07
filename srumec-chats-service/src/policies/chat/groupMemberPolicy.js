import { produceFail } from "#lib/fail/fail.js";
import * as fields from "#policies/chat/fieldList.js";

export const policy = {
  validateGetAll(req, _, actorMembership) {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return;

    if (!actorMembership) {
      throw produceFail(
        "MCa2EkEjcYzysfu4",
        "You must be a group member to view the member list."
      );
    }
    return;
  },

  validateCreate(req, data, actorMembership) {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return;

    if (!actorMembership || actorMembership.role !== "admin") {
      throw produceFail(
        "TTgEERs1oyceawBY",
        "You must be a group admin to add new members."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_CREATABLE_FIELDS_GROUP_MEMBERSHIP.includes(key)) {
          throw produceFail(
            "hwKxAj1vNgjBdmHw",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return;
  },

  validateUpdate(req, data, { actorMembership, targetMember }) {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return;

    if (!actorMembership || actorMembership.role !== "admin") {
      throw produceFail(
        "4gCDsXQ2zdXbU5An",
        "You must be a group admin to update another member."
      );
    }

    if (targetMember.role === "admin") {
      throw produceFail(
        "ml2afNDLZ49rIMfw",
        "Group admin cannot modify another admin."
      );
    }

    if (!isAdmin) {
      Object.keys(data).forEach((key) => {
        if (!fields.USER_UPDATABLE_FIELDS_GROUP_MEMBERSHIP.includes(key)) {
          throw produceFail(
            "RlWMj4RfrrY3samA",
            `Field '${key}' is not allowed for role '${req.user.role}'`
          );
        }
      });
    }

    return;
  },

  validateDelete(req, data, { actorMembership, targetMember }) {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return;

    if (!actorMembership) {
      throw produceFail(
        "m0Y3zoqekLT3HaarN",
        "You must be a group member to remove members."
      );
    }

    if (targetMember.user_ref === req.user.id) return;

    if (actorMembership.role !== "admin") {
      throw produceFail(
        "Nzz1zBsISkWqYmaI",
        "Only group admin can remove other members."
      );
    }

    if (targetMember.role === "admin") {
      throw produceFail(
        "L5Kw6I8sVTQ6GQib",
        "Group admin cannot remove another admin."
      );
    }

    return;
  },
};
