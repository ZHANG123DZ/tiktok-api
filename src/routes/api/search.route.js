const express = require('express');
const searchController = require('@/controllers/search.controller');

const router = express.Router();

router.get('/', searchController.search);
router.get('/suggestion', searchController.suggestion);

module.exports = router;
