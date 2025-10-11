const express = require('express');
const topicsController = require('@/controllers/topic.controller');
const auth = require('@/middlewares/auth');

const router = express.Router();

router.get('/', topicsController.index);
router.get('/:slug', topicsController.show);

module.exports = router;
