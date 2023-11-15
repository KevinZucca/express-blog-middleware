const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts");
const multer = require("multer");
const authenticateMiddleware = require("../middlewares/authenticateUser");

router.get("/", postController.index);
router.post(
  "/",
  authenticateMiddleware,
  multer({ dest: "public/imgs/posts" }).single("image"),
  postController.store
);
router.get("/create", postController.create);
router.get("/:slug", postController.show);
router.delete("/:slug", postController.destroy);
router.get("/:slug/download", postController.download);

module.exports = router;
