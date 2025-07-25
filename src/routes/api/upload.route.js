const express = require("express");
const uploadController = require("@/controllers/upload.controller");
const authJWT = require("@/middlewares/authJWT");

const upload = require("@/middlewares/multer");

const router = express.Router();

router.post(
  "/upload-file",
  authJWT,
  upload.any(),
  uploadController.uploadSingleFile
);

router.post(
  "/upload-multi-file",
  authJWT,
  upload.any(),
  uploadController.uploadMultipleFiles
);

router.patch("/replace", authJWT, upload.any(), uploadController.replace);

router.delete("/delete/:url", authJWT, uploadController.deleteFile);

module.exports = router;
