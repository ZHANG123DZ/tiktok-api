const express = require("express");
const conversationsController = require("@/controllers/conversation.controller");
const auth = require("@/middlewares/auth");

const router = express.Router({ mergeParams: true });

router.post("/", auth, conversationsController.create);
router.get("/", auth, conversationsController.getAllByUser);
router.get("/:id", auth, conversationsController.getById);
router.put("/:id", auth, conversationsController.update);
router.delete("/:id", auth, conversationsController.remove);
router.post("/get-or-create", auth, conversationsController.getOrCreate);

module.exports = router;
