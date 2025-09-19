const express = require('express');
const translateController = require('@/controllers/translate.controller');

const router = express.Router();

router.post('/', translateController.translate);

module.exports = router;
