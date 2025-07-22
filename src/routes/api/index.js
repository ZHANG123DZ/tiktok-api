const express = require("express");
const router = express.Router({ mergeParams: true });

const userRouter = require("./user.route");
const commentRouter = require("./comment.route");
const postRouter = require("./post.route");
const topicRouter = require("./topic.route");
const authRouter = require("./auth.route");
const followRouter = require("./follow.route");
const likeRouter = require("./like.route");
const bookmarkRouter = require("./book_mark.route");
const mediaRouter = require("./media.route");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/topics", topicRouter);
router.use("/follows", followRouter);
router.use("/topics", topicRouter);
router.use("/likes", likeRouter);
router.use("/book-marks", bookmarkRouter);
router.use("/media", mediaRouter);
//Route cho posts và các thành phần con
router.use("/posts", postRouter);
router.use("/posts/:slug/comments", commentRouter);

module.exports = router;
