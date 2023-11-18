const express = require("express");
const router = express.Router();
const controller = require("./controllers");

// Group routes
router.post("/get-activities", controller.getActivities);

module.exports = router;
