const express = require("express");
const likeController = require("@/controllers/like.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

router.get("/liked-by/:type/:id", likeController.getLikes);
router.get("/list/:type/:id", likeController.getLikedUserId);
router.post("/:type/:id", auth, likeController.like);
router.delete("/:type/:id", auth, likeController.unlike);
router.get("/check/:type/:id", auth, likeController.check);

module.exports = router;
