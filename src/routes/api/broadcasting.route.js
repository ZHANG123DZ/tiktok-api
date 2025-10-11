const express = require('express');
const broadcastingController = require('@/controllers/broadcasting.controller');
const auth = require('@/middlewares/auth');

const router = express.Router({ mergeParams: true });

router.post('/auth', auth, broadcastingController.index);

module.exports = router;
