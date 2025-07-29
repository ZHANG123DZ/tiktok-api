const express = require("express");
const mediaController = require("@/controllers/media.controller");
const auth = require("@/middlewares/auth");

const upload = require("@/middlewares/multer");

const router = express.Router();

router.get("/get:url", mediaController.getPublicIdFromUrl);

router.post("/upload", auth, upload.any(), mediaController.uploadSingleFile);

router.post(
  "/upload-multi",
  auth,
  upload.any(),
  mediaController.uploadMultipleFiles
);

router.patch("/replace", auth, upload.any(), mediaController.replace);

router.delete("/delete:url", auth, mediaController.del);

module.exports = router;
