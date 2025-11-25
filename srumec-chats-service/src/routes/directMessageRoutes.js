import express from "express";
import { validate } from "#middleware/validate.js";

import {
  GetAllMessagesReq,
  CreateMessageReq,
  UpdateMessageReq,
  DeleteOneMessageReq,
} from "#validators/chatMessageSchemas.js";

import { controller } from "#controllers/directMessageController.js";

const router = express.Router();

router.post(
  "/get-all",
  validate(GetAllMessagesReq),
  controller.getAllDirectMessages
);

router.post(
  "/create-one",
  validate(CreateMessageReq),
  controller.createDirectMessage
);

router.post(
  "/update-one",
  validate(UpdateMessageReq),
  controller.updateDirectMessage
);

router.post(
  "/delete-one",
  validate(DeleteOneMessageReq),
  controller.deleteDirectMessage
);

export default router;
