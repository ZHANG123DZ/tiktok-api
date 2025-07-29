const express = require("express");
const commentsController = require("@/controllers/comment.controller");
const auth = require("@/middlewares/auth");
const getCurrentUser = require("@/middlewares/getCurrentUser");

const router = express.Router({ mergeParams: true });

router.get("/", getCurrentUser, commentsController.index);
router.get("/:id", commentsController.show);
router.post("/", auth, commentsController.store);
router.put("/:id", commentsController.update);
router.patch("/:id", commentsController.update);
router.delete("/:id", auth, commentsController.destroy);

module.exports = router;
