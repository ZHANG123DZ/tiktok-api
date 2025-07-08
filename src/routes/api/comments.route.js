const express = require('express');
const commentsController = require('@/controllers/api/comments.controller');

const {
  createCommentValidator,
  updateCommentValidator,
} = require('@/validator/comments.validator');

const router = express.Router({mergeParams: true});

router.get('/', commentsController.show);
router.get('/:id', commentsController.index);
router.post('/', createCommentValidator, commentsController.store);
router.put('/:id', updateCommentValidator, commentsController.update);
router.patch('/:id', updateCommentValidator, commentsController.update);
router.delete('/:id', commentsController.destroy);

module.exports = router;