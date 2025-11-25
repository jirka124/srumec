import express from "express";
import { validate } from "#middleware/validate.js";

import {
  GetAllDirectRoomsReq,
  GetOneDirectRoomReq,
  CreateOneDirectRoomReq,
  UpdateOneDirectRoomReq,
  DeleteOneDirectRoomReq,
} from "#validators/chatRoomSchemas.js";

import { controller } from "#controllers/directRoomController.js";

const router = express.Router();

router.post(
  "/get-all",
  validate(GetAllDirectRoomsReq),
  controller.getAllDirectRooms
);

router.post(
  "/get-one",
  validate(GetOneDirectRoomReq),
  controller.getOneDirectRoom
);

router.post(
  "/create-one",
  validate(CreateOneDirectRoomReq),
  controller.createOneDirectRoom
);

router.post(
  "/update-one",
  validate(UpdateOneDirectRoomReq),
  controller.updateOneDirectRoom
);

router.post(
  "/delete-one",
  validate(DeleteOneDirectRoomReq),
  controller.deleteOneDirectRoom
);

export default router;
