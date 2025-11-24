import { Router } from "express";
import { commentController } from "#controllers/commentController.js";
import { validate } from "#middleware/validate.js";
import {
  CommentGetAllReqSchema,
  CommentCreateReqSchema,
  CommentUpdateReqSchema,
  CommentDeleteReqSchema,
} from "#validators/commentSchemas.js";

const router = Router();

router.post(
  "/get-all",
  validate(CommentGetAllReqSchema),
  commentController.getAll
);
router.post(
  "/create-one",
  validate(CommentCreateReqSchema),
  commentController.createOne
);
router.post(
  "/update-one",
  validate(CommentUpdateReqSchema),
  commentController.updateOne
);
router.post(
  "/delete-one",
  validate(CommentDeleteReqSchema),
  commentController.deleteOne
);

export default router;
