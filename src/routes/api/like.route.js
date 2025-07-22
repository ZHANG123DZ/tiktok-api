const express = require("express");
const likeController = require("@/controllers/like.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/liked-by/:type/:id", likeController.getLikes);
router.get("/list/:type/:id", likeController.getLikedUserId);
router.post("/:type/:id", authJWT, likeController.like);
router.delete("/:type/:id", authJWT, likeController.unlike);
router.get("/check/:type/:id", authJWT, likeController.check);

module.exports = router;
