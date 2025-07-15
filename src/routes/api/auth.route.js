const express = require("express");
const authController = require("@/controllers/auth.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/me", authController.auth);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.sendForgotEmail);
router.post("/reset-password", authController.resetPassword);
// router.post('/new-password/:token', authController.setNewPassword);
router.post("/send-code", authController.sendCode);
router.post("/verify-email", authController.verifyEmail);
router.post("/check-email", authController.checkEmail);
router.post("/check-username", authController.checkUsername);
// router.post('/verify-email/resend', authController.resendVerifyEmail);
router.post("/logout", authController.logout);

module.exports = router;
