import { Router } from "express";
import { eventController } from "#controllers/eventController.js";
import { validate } from "#middleware/validate.js";
import {
  GetNearbyReqSchema,
  GetOneReqSchema,
  EventCreateReqSchema,
  EventUpdateReqSchema,
  DeleteOneReqSchema,
} from "#validators/eventSchemas.js";

const router = Router();

router.post(
  "/get-nearby",
  validate(GetNearbyReqSchema),
  eventController.getNearby
);
router.post("/get-one", validate(GetOneReqSchema), eventController.getOne);
router.post(
  "/create-one",
  validate(EventCreateReqSchema),
  eventController.createOne
);
router.post(
  "/update-one",
  validate(EventUpdateReqSchema),
  eventController.updateOne
);
router.post(
  "/delete-one",
  validate(DeleteOneReqSchema),
  eventController.deleteOne
);

export default router;
