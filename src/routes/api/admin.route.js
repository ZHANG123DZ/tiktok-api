const express = require('express');
const adminController = require('@/controllers/admin.controller');
const auth = require('@/middlewares/auth');

const router = express.Router();

router.post('/login', adminController.login);
router.post('/change-password', auth, adminController.changePassword);
router.post('/edit-profile', auth, adminController.editProfile);

module.exports = router;
