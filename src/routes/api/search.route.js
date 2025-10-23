const express = require('express');
const searchController = require('@/controllers/search.controller');

const router = express.Router();

router.get('/', searchController.search);
router.post('/suggestion', searchController.suggestion);
router.get('/history', searchController.getHistory);
// router.get('/:id', searchController.getOne);
router.post('/', searchController.create);
router.delete('/', searchController.clearAll);
// router.put('/:id', searchController.update);
router.delete('/:id', searchController.softDelete);

module.exports = router;
