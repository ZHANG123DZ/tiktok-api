const express = require("express");
const followController = require("@/controllers/follow.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

router.get("/followed-by/:type/:id", followController.getFollowers);
router.get("/list/:type/:id", followController.getFollowing);
router.post("/:type/:id", auth, followController.follow);
router.delete("/:type/:id", auth, followController.unfollow);
router.get("/check/:type/:id", auth, followController.check);

module.exports = router;
