const express = require('express');
const tagController = require('@/controllers/tag.controller');

const router = express.Router();

router.get('/:name', tagController.show);

module.exports = router;
