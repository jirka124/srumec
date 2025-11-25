import express from "express";
import { validate } from "#middleware/validate.js";

import {
  GetAllGroupMembersReq,
  CreateGroupMemberReq,
  UpdateGroupMemberReq,
  DeleteGroupMemberReq,
} from "#validators/chatGroupMemberSchemas.js";
import { controller } from "#controllers/chatGroupMemberController.js";

const router = express.Router();

router.post(
  "/get-all",
  validate(GetAllGroupMembersReq),
  controller.getAllMembers
);

router.post(
  "/create-one",
  validate(CreateGroupMemberReq),
  controller.createMember
);

router.post(
  "/update-one",
  validate(UpdateGroupMemberReq),
  controller.updateMember
);

router.post(
  "/delete-one",
  validate(DeleteGroupMemberReq),
  controller.deleteMember
);

export default router;
