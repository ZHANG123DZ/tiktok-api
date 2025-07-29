const express = require("express");
const notificationController = require("@/controllers/notification.controller");

const router = express.Router();

router.get("/", notificationController.getNotify);
router.patch("/:id", notificationController.update);

module.exports = router;
