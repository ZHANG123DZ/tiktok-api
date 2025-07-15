const express = require("express");
const followController = require("@/controllers/follow.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/followed-by/:type/:id", followController.getFollowers);
router.get("/list/:type/:id", followController.getFollowing);
router.post("/:type/:id", authJWT, followController.follow);
router.delete("/:type/:id", authJWT, followController.unfollow);
router.get("/check/:type/:id", authJWT, followController.check);

module.exports = router;
