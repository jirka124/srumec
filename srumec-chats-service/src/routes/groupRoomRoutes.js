import express from "express";
import { validate } from "#middleware/validate.js";

import {
  GetAllGroupRoomsReq,
  GetOneGroupRoomReq,
  CreateOneGroupRoomReq,
  UpdateOneGroupRoomReq,
  DeleteOneGroupRoomReq,
} from "#validators/chatRoomSchemas.js";

import { controller } from "#controllers/groupRoomController.js";

const router = express.Router();

router.post(
  "/get-all",
  validate(GetAllGroupRoomsReq),
  controller.getAllGroupRooms
);

router.post(
  "/get-one",
  validate(GetOneGroupRoomReq),
  controller.getOneGroupRoom
);

router.post(
  "/create-one",
  validate(CreateOneGroupRoomReq),
  controller.createOneGroupRoom
);

router.post(
  "/update-one",
  validate(UpdateOneGroupRoomReq),
  controller.updateOneGroupRoom
);

router.post(
  "/delete-one",
  validate(DeleteOneGroupRoomReq),
  controller.deleteOneGroupRoom
);

export default router;
