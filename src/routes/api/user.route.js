const express = require('express');
const userController = require('@/controllers/user.controller');
const adminMiddleware = require('@/middlewares/adminMiddleware');

const router = express.Router();

router.get('/', userController.index);
router.post('/banned/:id', adminMiddleware, userController.banned);
router.get('/intro', userController.getIntroUsers);
router.get('/:key', userController.show);
router.get('/:key/posts', userController.getUserPosts);

module.exports = router;
