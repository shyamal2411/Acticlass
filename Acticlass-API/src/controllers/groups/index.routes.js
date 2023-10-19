const express = require('express');
const router = express.Router();

// Group routes
router.use(require('./group/group.routes'));

module.exports = router;
