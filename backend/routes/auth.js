const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const checkJwt = require('../middleware/auth');




// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', checkJwt, authController.getCurrentUser);
router.post('/check-username', checkJwt, authController.checkUsername);
router.put('/profile', checkJwt, authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/verify-email', authController.verifyEmail);
// router.post('/resend-verification', authController.resendVerificationEmail);

module.exports = router;