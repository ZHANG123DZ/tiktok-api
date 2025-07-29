const express = require("express");
const topicsController = require("@/controllers/topic.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

router.get("/", topicsController.index);
router.get("/:slug", topicsController.show);
router.post("/", auth, topicsController.store);
router.put("/:slug", auth, topicsController.update);
router.patch("/:slug", auth, topicsController.update);
router.delete("/:slug", auth, topicsController.destroy);

module.exports = router;
