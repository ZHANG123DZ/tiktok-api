const express = require('express');
const searchController = require('@/controllers/search.controller');

const router = express.Router();

router.get('/', searchController.search);
router.post('/suggestion', searchController.suggestion);

module.exports = router;
