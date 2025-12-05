import express from "express";
import { validate } from "#middleware/validate.js";

import {
  GetAllMessagesReq,
  GetOneMessageReq,
  CreateMessageReq,
  UpdateMessageReq,
  DeleteOneMessageReq,
} from "#validators/chatMessageSchemas.js";

import { controller } from "#controllers/groupMessageController.js";

const router = express.Router();

router.post(
  "/get-all",
  validate(GetAllMessagesReq),
  controller.getAllGroupMessages
);

router.post(
  "/get-one",
  validate(GetOneMessageReq),
  controller.getOneGroupMessage
);

router.post(
  "/create-one",
  validate(CreateMessageReq),
  controller.createGroupMessage
);

router.post(
  "/update-one",
  validate(UpdateMessageReq),
  controller.updateGroupMessage
);

router.post(
  "/delete-one",
  validate(DeleteOneMessageReq),
  controller.deleteGroupMessage
);

export default router;
