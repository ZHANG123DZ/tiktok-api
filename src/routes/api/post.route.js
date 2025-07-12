const express = require("express");
const postsController = require("@/controllers/post.controller");

const router = express.Router();

router.get("/", postsController.index);
router.get("/:key", postsController.show);
router.post("/", postsController.store);
router.put("/:key", postsController.update);
router.patch("/:key", postsController.update);
router.delete("/:key", postsController.destroy);

module.exports = router;
