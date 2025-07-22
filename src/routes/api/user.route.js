const express = require("express");
const userController = require("@/controllers/user.controller");

const router = express.Router();

router.get("/", userController.index);
router.get("/:key", userController.show);
router.get("/:key/posts", userController.getUserPosts);

module.exports = router;
