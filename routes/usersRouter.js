import express from "express";
import UserController from "../controllers/userController.js";
import uploadMiddleware from "../middleware/upload.js";

// імпорт у змінну результату виконання express роутера
const router = express.Router();

// PATCH / users / avatars
router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  UserController.updateAvatar
);

export default router;
