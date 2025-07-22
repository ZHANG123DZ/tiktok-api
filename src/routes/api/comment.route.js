const express = require("express");
const commentsController = require("@/controllers/comment.controller");
const authJWT = require("@/middlewares/authJWT");
const getCurrentUser = require("@/middlewares/getCurrentUser");

const router = express.Router({ mergeParams: true });

router.get("/", getCurrentUser, commentsController.index);
router.get("/:id", commentsController.show);
router.post("/", authJWT, commentsController.store);
router.put("/:id", commentsController.update);
router.patch("/:id", commentsController.update);
router.delete("/:id", authJWT, commentsController.destroy);

module.exports = router;
