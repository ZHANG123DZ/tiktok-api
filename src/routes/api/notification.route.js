const express = require('express');
const notificationController = require('@/controllers/notification.controller');

const router = express.Router();

router.get('/', notificationController.getAllNotify);
router.get('/:id', notificationController.getNotify);
router.patch('/:id', notificationController.update);
router.patch('/read-all', notificationController.readAll);

module.exports = router;
