const express = require("express");
const mediaController = require("@/controllers/media.controller");
const authJWT = require("@/middlewares/authJWT");

const upload = require("@/middlewares/multer");

const router = express.Router();

router.get("/get:url", mediaController.getPublicIdFromUrl);

router.post("/upload", authJWT, upload.any(), mediaController.uploadSingleFile);

router.post(
  "/upload-multi",
  authJWT,
  upload.any(),
  mediaController.uploadMultipleFiles
);

router.patch("/replace", authJWT, upload.any(), mediaController.replace);

router.delete("/delete:url", authJWT, mediaController.del);

module.exports = router;
