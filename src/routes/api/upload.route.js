const express = require("express");
const uploadController = require("@/controllers/upload.controller");
const auth = require("@/middlewares/auth");

const upload = require("@/middlewares/multer");

const router = express.Router();

router.post(
  "/upload-file",
  auth,
  upload.any(),
  uploadController.uploadSingleFile
);

router.post(
  "/upload-multi-file",
  auth,
  upload.any(),
  uploadController.uploadMultipleFiles
);

router.patch("/replace", auth, upload.any(), uploadController.replace);

router.delete("/delete/:url", auth, uploadController.deleteFile);

module.exports = router;
