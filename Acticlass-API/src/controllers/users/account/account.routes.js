const express = require('express');
const router = express.Router();
const controller = require('./controllers');

// User routes
router.post('/signup', controller.register);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-code', controller.verifyResetPasswordCode);

router.use(require('../../../middleware/index'));

router.post('/reset-password', controller.resetPassword);
router.post('/change-password', controller.changePassword);
router.delete('/profile', controller.deleteProfile);

module.exports = router;
