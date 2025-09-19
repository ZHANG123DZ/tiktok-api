const express = require('express');
const postsController = require('@/controllers/post.controller');
const auth = require('@/middlewares/auth');

const router = express.Router();

router.get('/', auth, postsController.index);
router.get('/latest', auth, postsController.latest);
router.get('/featured', auth, postsController.featured);
router.post('/related', auth, postsController.related);
router.get('/:key', postsController.show);
router.post('/', auth, postsController.store);
router.put('/:key', auth, postsController.update);
router.patch('/:key', auth, postsController.update);
router.delete('/:key', auth, postsController.destroy);

module.exports = router;
