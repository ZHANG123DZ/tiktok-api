const express = require('express');
const postsController = require('@/controllers/api/posts.controller');

const {
  createPostValidator,
  updatePostValidator,
} = require('@/validator/posts.validator');

const router = express.Router();

router.get('/', postsController.index);
router.get('/:id', postsController.show);
router.post('/', createPostValidator, postsController.store);
router.put('/:id', updatePostValidator, postsController.update);
router.patch('/:id', updatePostValidator, postsController.update);
router.delete('/:id', postsController.destroy);

module.exports = router;