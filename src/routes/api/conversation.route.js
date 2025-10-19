const express = require('express');
const conversationsController = require('@/controllers/conversation.controller');

const router = express.Router({ mergeParams: true });

router.post('/', conversationsController.create);
router.get('/', conversationsController.getAllByUser);
router.get('/:id', conversationsController.getById);
router.put('/:id', conversationsController.update);
router.delete('/:id', conversationsController.remove);
router.post('/get-or-create', conversationsController.getOrCreate);
router.patch('/:id/marked-read', conversationsController.markedRead);
router.post('/:id/status', conversationsController.setStatus);

module.exports = router;
