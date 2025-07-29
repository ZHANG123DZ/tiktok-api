const express = require("express");
const messagesController = require("@/controllers/message.controller");

const router = express.Router({ mergeParams: true });

router.get("/", messagesController.index);
router.get("/:id", messagesController.show);
router.post("/", messagesController.store);
router.put("/:id", messagesController.update);
router.patch("/:id", messagesController.update);
router.delete("/:id", messagesController.destroy);

module.exports = router;
