const express = require('express');
const router = express.Router({ mergeParams: true });

const userRouter = require('./user.route');
const commentRouter = require('./comment.route');
const postRouter = require('./post.route');
const topicRouter = require('./topic.route');
const authRouter = require('./auth.route');
const followRouter = require('./follow.route');
const likeRouter = require('./like.route');
const bookmarkRouter = require('./book_mark.route');
const mediaRouter = require('./media.route');
const uploadRouter = require('./upload.route');
const conversationRouter = require('./conversation.route');
const messagesRouter = require('./message.route');
const notificationRouter = require('./notification.route');
const musicRouter = require('./music.route');
const tagRouter = require('./tag.route');
const searchRouter = require('./search.route');
const translateRouter = require('./translate.route');
const auth = require('@/middlewares/auth');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/musics', musicRouter);
router.use('/tags', tagRouter);
router.use('/topics', topicRouter);
router.use('/follows', followRouter);
router.use('/notifications', auth, notificationRouter);
router.use('/likes', likeRouter);
router.use('/book-marks', bookmarkRouter);
router.use('/media', mediaRouter);
router.use('/upload', uploadRouter);
router.use('/conversations/:conversation/messages', messagesRouter);
router.use('/conversations', auth, conversationRouter);
router.use('/search', searchRouter);
router.use('/translate', translateRouter);

//Route cho posts và các thành phần con
router.use('/posts', postRouter);
router.use('/posts/:slug/comments', commentRouter);

module.exports = router;
