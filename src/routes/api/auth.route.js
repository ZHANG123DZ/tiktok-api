const express = require('express');
const authController = require('@/controllers/auth.controller');
const auth = require('@/middlewares/auth');

const router = express.Router();

router.get('/me', authController.auth);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/socials/:social/callback', authController.social);
router.post('/refresh-token', authController.refreshTok);
router.post('/forgot-password', authController.sendForgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);
router.post('/edit-profile', auth, authController.editProfile);
router.patch('/settings', auth, authController.settings);
router.get('/settings', auth, authController.userSetting);
router.post('/send-code', authController.sendCode);
router.post('/verify-code', authController.verifyCode);
router.post('/verify-email', authController.verifyEmail);
router.post('/check-email', authController.checkEmail);
router.post('/check-username', authController.checkUsername);
router.post('/logout', auth, authController.logout);

module.exports = router;
