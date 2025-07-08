const express = require('express');
const usersController = require('@/controllers/api/users.controller');

const router = express.Router();

router.get('/', usersController.index);
router.get('/:username', usersController.show);
router.post('/', usersController.create);
// router.user('/', usersController.store);
router.put('/:id', usersController.update);
// router.patch('/:id', usersController.update);
router.delete('/:id', usersController.destroy);

module.exports = router;
