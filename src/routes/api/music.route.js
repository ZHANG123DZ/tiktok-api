const express = require('express');
const musicController = require('@/controllers/music.controller');

const router = express.Router();

router.get('/:id', musicController.show);

module.exports = router;
