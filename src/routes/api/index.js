const express = require('express');
const router = express.Router({ mergeParams: true });
const authRouter = require('./auth.route');

const commentsRouter = require('./comments.route');
const postsRouter = require('./posts.route');
const usersRouter = require('./users.route');

router.use('/users', usersRouter);
router.use('/auth', authRouter);

//Route cho posts và các thành phần con
router.use('/posts', postsRouter);
router.use('/posts/:post_id/comments', commentsRouter);
// router.use('/posts/:post_id/likes', likesRouter);

module.exports = router;
