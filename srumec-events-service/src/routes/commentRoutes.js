import { Router } from "express";
import { commentController } from "#controllers/commentController.js";
import { validate } from "#middleware/validate.js";
import { authUser } from "#middleware/auth-user.js";
import {
  CommentGetAllReqSchema,
  CommentGetOneReqSchema,
  CommentCreateReqSchema,
  CommentUpdateReqSchema,
  CommentDeleteReqSchema,
} from "#validators/commentSchemas.js";

const router = Router();

router.use(authUser);

router.post(
  "/get-all",
  validate(CommentGetAllReqSchema),
  commentController.getAll
);
router.post(
  "/get-one",
  validate(CommentGetOneReqSchema),
  commentController.getOne
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
