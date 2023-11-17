const express = require("express");
const router = express.Router();
const controller = require("./controllers");

// Group routes
router.get("/get-activity/:date", controller.getActivities);
router.get(
  "/get-activity-by-group-and-range/:groupId/:startDate/:endDate",
  controller.getActivitiesByGroupAndRange
);

module.exports = router;
