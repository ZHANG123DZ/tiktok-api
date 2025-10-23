const express = require('express');
const repostController = require('@/controllers/repost.controller');
const auth = require('@/middlewares/auth');

const router = express.Router({ mergeParams: true });

router.get('/:id', repostController.index);
// router.get('/:id', repostController.show);
router.post('/', auth, repostController.store);
router.delete('/:id', auth, repostController.destroy);

module.exports = router;
