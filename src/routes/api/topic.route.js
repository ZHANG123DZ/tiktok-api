const express = require("express");
const topicsController = require("@/controllers/topic.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/", topicsController.index);
router.get("/:slug", topicsController.show);
router.post("/", authJWT, topicsController.store);
router.put("/:slug", authJWT, topicsController.update);
router.patch("/:slug", authJWT, topicsController.update);
router.delete("/:slug", authJWT, topicsController.destroy);

module.exports = router;
