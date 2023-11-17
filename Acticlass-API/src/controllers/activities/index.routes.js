const express = require("express");
const router = express.Router();

// Activty routes
router.use(require("./activity/activity.routes"));

module.exports = router;
