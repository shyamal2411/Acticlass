const express = require('express');
const router = express.Router();

// User routes
router.use(require('./account/account.routes'));

module.exports = router;
